import { Mastra } from "@mastra/core";
import { exampleWorkflow } from "./workflows/example.js";
import { preferenceWorkflow } from "./workflows/preference.js";
import { preferenceAgent, normalizationAgent } from "./agents.js";

export const mastra = new Mastra({
  workflows: { exampleWorkflow, preference: preferenceWorkflow },
  agents: { preferenceAgent, normalizationAgent },
});
