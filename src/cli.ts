import { mastra } from "./mastra/index.js";
import { questions } from "./questions.js";
import { listModels } from "./models.js";
import { RequestContext } from "@mastra/core/request-context";
import fs from "fs";
import path from "path";

const [, , command, workflowKey, jsonInput] = process.argv;

function printUsage() {
  console.log(`
Mastra Workflow CLI

Usage:
  npm run cli list                          List available workflows
  npm run cli run                           Run full preference benchmark
  npm run cli run preference [questionId]   Run preference benchmark for one question
  npm run cli run <workflow> [json-input]   Run a workflow with JSON input

Examples:
  npm run cli list
  npm run cli run
  npm run cli run preference cat-or-dog
  npm run cli run exampleWorkflow '{"text": "hello world"}'
`);
}

async function listWorkflows() {
  const workflows = mastra.listWorkflows();
  const keys = Object.keys(workflows);
  if (keys.length === 0) {
    console.log("No workflows registered.");
    return;
  }
  console.log("Available workflows:");
  for (const key of keys) {
    console.log(`  ${key}`);
  }
}

async function runWorkflow(key: string, input: string | undefined) {
  let inputData: Record<string, unknown> = {};

  if (input) {
    try {
      inputData = JSON.parse(input);
    } catch {
      console.error(`Error: invalid JSON input: ${input}`);
      process.exit(1);
    }
  }

  const workflow = mastra.getWorkflow(key as any);
  const run = await workflow.createRun();

  console.log(`Running workflow "${key}"...`);

  const requestContext = new RequestContext();
  for (const [k, v] of Object.entries(inputData)) {
    requestContext.set(k, v);
  }

  const result = await run.start({ inputData: inputData as any, requestContext });

  if (result.status === "success") {
    console.log("\nResult:");
    console.log(JSON.stringify(result.result, null, 2));
  } else if (result.status === "failed") {
    console.error("\nWorkflow failed:");
    console.error(result.error);
    process.exit(1);
  } else {
    console.log(`\nWorkflow ended with status: ${result.status}`);
    console.log(JSON.stringify(result, null, 2));
  }
}

type Answer = { value: string; count: number; percent: number };

type RawRun = {
  prompt: string;
  rawResponse: string;
  normalizedAnswer: string;
};

type ModelResult = {
  model: string;
  company: string;
  runs: number;
  answers: Answer[];
  raw: RawRun[];
};

type QuestionFile = {
  id: string;
  prompts: string[];
  displayQuestion?: string;
  note?: string;
  results: ModelResult[];
};

function readQuestionFile(filePath: string): QuestionFile | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as QuestionFile;
}

function writeQuestionFile(filePath: string, data: QuestionFile) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(6)}`;
  return `$${cost.toFixed(4)}`;
}

function aggregateAnswers(allAnswers: string[]): Answer[] {
  const total = allAnswers.length;
  const counts = new Map<string, number>();
  for (const val of allAnswers) {
    counts.set(val, (counts.get(val) ?? 0) + 1);
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const answers = entries.map(([value, count]) => ({
    value,
    count,
    percent: Math.round((count / total) * 1000) / 10,
  }));
  const sum = answers.reduce((acc, a) => acc + a.percent, 0);
  const diff = Math.round((100 - sum) * 10) / 10;
  if (answers.length > 0 && diff !== 0) {
    answers[0].percent = Math.round((answers[0].percent + diff) * 10) / 10;
  }
  return answers;
}

async function runWorkflowBatch(
  workflow: any,
  prompts: string[],
  normalizationPrompt: string,
  modelName: string
): Promise<{ runs: RawRun[]; preferenceCost: number; normalizationCost: number } | null> {
  const requestContext = new RequestContext();
  requestContext.set("modelName", modelName);

  const run = await workflow.createRun();
  const result = await run.start({
    inputData: { prompts, normalizationPrompt } as any,
    requestContext,
  });

  if (result.status !== "success") {
    console.error(`  Failed: ${(result as any).error}`);
    return null;
  }

  return result.result as { runs: RawRun[]; preferenceCost: number; normalizationCost: number };
}

async function runBenchmark(questionId?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENROUTER_API_KEY environment variable is required.");
    process.exit(1);
  }

  const consensusThreshold = parseInt(process.env.CONSENSUS_THRESHOLD ?? "5", 10);
  const batchSize = parseInt(process.env.BATCH_SIZE ?? String(consensusThreshold), 10);
  const maxRuns = parseInt(process.env.MAX_RUNS ?? "20", 10);

  const models = listModels();
  const resultsDir = path.join(process.cwd(), "results");

  const workflow = mastra.getWorkflow("preference" as any);

  let filteredQuestions = questions;
  if (questionId) {
    filteredQuestions = questions.filter((q) => q.id === questionId);
    if (filteredQuestions.length === 0) {
      console.error(`Error: unknown question id "${questionId}". Available ids:`);
      for (const q of questions) console.error(`  ${q.id}`);
      process.exit(1);
    }
  }

  const totalInvocations = filteredQuestions.length * models.length;
  let current = 0;
  let grandTotalCost = 0;

  for (const q of filteredQuestions) {
    for (const model of models) {
      current++;
      const shortModel = model.name.split("/").pop() ?? model.name;
      console.log(`Running "${q.id}" × ${shortModel} (${current}/${totalInvocations})...`);

      const allAnswers: string[] = [];
      const allRawRuns: RawRun[] = [];
      let totalRuns = 0;
      let totalPrefCost = 0;
      let totalNormCost = 0;
      let batchNum = 0;

      while (true) {
        const remaining = maxRuns - totalRuns;
        if (remaining <= 0) break;
        const thisBatch = Math.min(batchSize, remaining);
        batchNum++;

        // Cycle through prompt variants for this batch
        const batchPrompts = Array.from({ length: thisBatch }, (_, i) =>
          q.prompts[(totalRuns + i) % q.prompts.length]
        );

        console.log(`  batch ${batchNum} (${thisBatch} runs)...`);
        const batchResult = await runWorkflowBatch(workflow, batchPrompts, q.normalizationPrompt, model.name);
        if (!batchResult) break;

        allAnswers.push(...batchResult.runs.map((r) => r.normalizedAnswer));
        allRawRuns.push(...batchResult.runs);
        totalRuns += thisBatch;
        totalPrefCost += batchResult.preferenceCost;
        totalNormCost += batchResult.normalizationCost;

        // Check consensus
        const counts = new Map<string, number>();
        for (const a of allAnswers) counts.set(a, (counts.get(a) ?? 0) + 1);
        const maxCount = Math.max(...counts.values());
        if (maxCount >= consensusThreshold) {
          const topAnswer = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
          console.log(`  consensus after ${totalRuns} runs: ${topAnswer[0]} (${topAnswer[1]}x)`);
          break;
        }
      }

      if (allAnswers.length === 0) continue;

      const totalCost = totalPrefCost + totalNormCost;
      grandTotalCost += totalCost;
      console.log(
        `  cost: preference ${formatCost(totalPrefCost)}, normalization ${formatCost(totalNormCost)}, total ${formatCost(totalCost)}`
      );

      const answers = aggregateAnswers(allAnswers);

      // Merge into results file
      const filePath = path.join(resultsDir, `${q.id}.json`);
      const existing = readQuestionFile(filePath);

      const modelResultEntry: ModelResult = {
        model: model.name,
        company: model.company,
        runs: totalRuns,
        answers,
        raw: allRawRuns,
      };

      let fileData: QuestionFile;
      if (existing) {
        fileData = existing;
        fileData.prompts = q.prompts;
        fileData.displayQuestion = q.displayQuestion;
        fileData.note = q.note;
        const idx = fileData.results.findIndex((r) => r.model === model.name);
        if (idx >= 0) {
          fileData.results[idx] = modelResultEntry;
        } else {
          fileData.results.push(modelResultEntry);
        }
      } else {
        fileData = {
          id: q.id,
          prompts: q.prompts,
          displayQuestion: q.displayQuestion,
          note: q.note,
          results: [modelResultEntry],
        };
      }

      writeQuestionFile(filePath, fileData);
      console.log(`  → ${answers.map((a) => `${a.value}: ${a.percent}%`).join(", ")}`);
    }
  }

  // Summary table
  console.log("\n--- Summary ---");
  console.log(`Total cost: ${formatCost(grandTotalCost)}`);
  for (const q of filteredQuestions) {
    const filePath = path.join(resultsDir, `${q.id}.json`);
    const data = readQuestionFile(filePath);
    if (!data) continue;
    console.log(`\n${q.id}:`);
    for (const r of data.results) {
      const short = r.model.split("/").pop() ?? r.model;
      const summary = r.answers.map((a) => `${a.value}: ${a.percent}%`).join(", ");
      console.log(`  ${short} (${r.runs} runs): ${summary}`);
    }
  }
}

async function main() {
  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  if (command === "list") {
    await listWorkflows();
    return;
  }

  if (command === "run" && !workflowKey) {
    await runBenchmark();
    return;
  }

  if (command === "run" && workflowKey === "preference") {
    // jsonInput is the questionId (positional arg, not JSON)
    await runBenchmark(jsonInput);
    return;
  }

  if (command === "run") {
    await runWorkflow(workflowKey, jsonInput);
    return;
  }

  console.error(`Unknown command: ${command}\n`);
  printUsage();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
