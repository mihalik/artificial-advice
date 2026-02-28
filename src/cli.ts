import { mastra } from "./mastra/index.js";

const [, , command, workflowKey, jsonInput] = process.argv;

function printUsage() {
  console.log(`
Mastra Workflow CLI

Usage:
  npm run cli list                          List available workflows
  npm run cli run <workflow> [json-input]   Run a workflow

Examples:
  npm run cli list
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

  const workflow = mastra.getWorkflow(key as keyof typeof mastra.workflows);
  const run = await workflow.createRun();

  console.log(`Running workflow "${key}"...`);

  const result = await run.start({ inputData });

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

async function main() {
  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  if (command === "list") {
    await listWorkflows();
    return;
  }

  if (command === "run") {
    if (!workflowKey) {
      console.error("Error: workflow name is required.\n");
      printUsage();
      process.exit(1);
    }
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
