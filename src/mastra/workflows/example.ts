import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const normalizeStep = createStep({
  id: "normalize",
  inputSchema: z.object({
    text: z.string(),
  }),
  outputSchema: z.object({
    normalized: z.string(),
    wordCount: z.number(),
  }),
  execute: async ({ inputData }) => {
    const normalized = inputData.text.trim().toLowerCase();
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    return { normalized, wordCount };
  },
});

const summarizeStep = createStep({
  id: "summarize",
  inputSchema: z.object({
    normalized: z.string(),
    wordCount: z.number(),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { normalized, wordCount } = inputData;
    const preview = normalized.length > 50 ? normalized.slice(0, 50) + "..." : normalized;
    return {
      summary: `${wordCount} word(s): "${preview}"`,
    };
  },
});

export const exampleWorkflow = createWorkflow({
  id: "example",
  inputSchema: z.object({
    text: z.string().describe("Text to process"),
  }),
  outputSchema: z.object({
    summary: z.string(),
  }),
})
  .then(normalizeStep)
  .then(summarizeStep)
  .commit();
