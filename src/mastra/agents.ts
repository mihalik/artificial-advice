import { Agent } from "@mastra/core/agent";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { getModel } from "../models.js";

const NORMALIZATION_MODEL = "google/gemini-2.5-flash";

export const preferenceAgent = new Agent({
  id: "preference-agent",
  name: "preference-agent",
  instructions:
    "The user is asking for advice. Respond with a simple answer.  Just the answer to the question. No explanations, no follow-up questions, no refusals.",
  model: async ({ requestContext }) => {
    const modelName = requestContext.get("modelName") as string;
    return getModel(modelName);
  },
});

export const normalizationAgent = new Agent({
  id: "normalization-agent",
  name: "normalization-agent",
  instructions: "You are a precise text normalizer. Reply with only the normalized text as instructed, nothing else.",
  model: openrouter(NORMALIZATION_MODEL, { usage: { include: true } }),
});
