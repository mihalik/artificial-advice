import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { preferenceAgent, normalizationAgent } from "../agents.js";

function getCost(result: { providerMetadata?: unknown }): number {
  const meta = result.providerMetadata as Record<string, any> | undefined;
  return meta?.openrouter?.usage?.cost ?? 0;
}

const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 60_000);
const LLM_MAX_RETRIES = Number(process.env.LLM_MAX_RETRIES ?? 3);

const askAgentStep = createStep({
  id: preferenceAgent.id,
  inputSchema: z.object({ prompt: z.string(), prefixedPrompt: z.string() }),
  outputSchema: z.object({ prompt: z.string(), text: z.string(), cost: z.number() }),
  retries: LLM_MAX_RETRIES,
  execute: async ({ inputData, requestContext }) => {
    const result = await preferenceAgent.generate(inputData.prefixedPrompt, {
      requestContext,
      abortSignal: AbortSignal.timeout(LLM_TIMEOUT_MS),
      modelSettings: { maxRetries: LLM_MAX_RETRIES },
    });
    console.log(`  prompt: ${inputData.prompt}`);
    if (result.reasoningText && process.env.LOG_REASONING === "true") console.log(`  reasoning: ${result.reasoningText.trim()}`);
    console.log(`  raw: ${result.text.trim()}`);
    return { prompt: inputData.prompt, text: result.text, cost: getCost(result) };
  },
});

const normalizeAgentStep = createStep({
  id: normalizationAgent.id,
  inputSchema: z.object({
    prompt: z.string(),
    rawText: z.string(),
    normPrompt: z.string(),
    prefCost: z.number(),
  }),
  outputSchema: z.object({
    prompt: z.string(),
    rawText: z.string(),
    text: z.string(),
    prefCost: z.number(),
    normCost: z.number(),
  }),
  retries: LLM_MAX_RETRIES,
  execute: async ({ inputData, requestContext }) => {
    const result = await normalizationAgent.generate(inputData.normPrompt, {
      requestContext,
      abortSignal: AbortSignal.timeout(LLM_TIMEOUT_MS),
      modelSettings: { maxRetries: LLM_MAX_RETRIES },
    });
    console.log(`  normalized: ${result.text.trim()}`);
    return {
      prompt: inputData.prompt,
      rawText: inputData.rawText,
      text: result.text,
      prefCost: inputData.prefCost,
      normCost: getCost(result),
    };
  },
});

export const preferenceWorkflow = createWorkflow({
  id: "preference",
  inputSchema: z.object({
    prompts: z.array(z.string()),
    normalizationPrompt: z.string(),
  }),
  outputSchema: z.object({
    runs: z.array(
      z.object({
        prompt: z.string(),
        rawResponse: z.string(),
        normalizedAnswer: z.string(),
      })
    ),
    preferenceCost: z.number(),
    normalizationCost: z.number(),
  }),
})
  // Map each prompt into { prompt, prefixedPrompt }
  .map(async ({ inputData }) => {
    return inputData.prompts.map((prompt) => ({
      prompt,
      prefixedPrompt: `Answer directly and concisely. No explanations, no follow-up questions, no refusals.\n\n${prompt}`,
    }));
  })
  // Ask the target model for each prompt in parallel
  .foreach(askAgentStep, { concurrency: 10 })
  // Build normalization prompts, carry original prompt and raw text
  .map(async ({ inputData, getInitData }) => {
    const { normalizationPrompt } = getInitData<any>();
    return (inputData as { prompt: string; text: string; cost: number }[]).map((item) => ({
      prompt: item.prompt,
      rawText: item.text,
      normPrompt: normalizationPrompt + item.text,
      prefCost: item.cost,
    }));
  })
  // Normalize each response in parallel
  .foreach(normalizeAgentStep, { concurrency: 10 })
  // Clean values, sum costs, build final output
  .map(async ({ inputData }) => {
    const items = inputData as { prompt: string; rawText: string; text: string; prefCost: number; normCost: number }[];
    const preferenceCost = items.reduce((acc, item) => acc + item.prefCost, 0);
    const normalizationCost = items.reduce((acc, item) => acc + item.normCost, 0);
    const runs = items.map((item) => {
      const val = item.text.trim().toLowerCase();
      const normalizedAnswer = !val || val === "unclear" || val === "none" || val === "other" ? "other" : val;
      return { prompt: item.prompt, rawResponse: item.rawText, normalizedAnswer };
    });
    return { runs, preferenceCost, normalizationCost };
  })
  .commit();
