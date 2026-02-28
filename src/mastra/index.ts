import { Mastra } from "@mastra/core";
import { exampleWorkflow } from "./workflows/example.js";

export const mastra = new Mastra({
  workflows: { exampleWorkflow },
});
