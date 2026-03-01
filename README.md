# artificial-advice

A benchmark tool that probes LLM opinion and preference tendencies. It asks the same subjective question to a model N times, normalizes each answer to a canonical value, and tallies the distribution — revealing whether a model leans one way or consistently hedges.

## How it works

For each question × model pair, the tool:

1. Sends the question to the target model N times (in parallel batches)
2. Passes each raw response through a normalization agent (Gemini Flash) to extract a canonical answer (e.g. `"cat"`, `"dog"`, `"yes"`, `"no"`, `"refusal"`)
3. Stops early once a consensus threshold is reached
4. Writes aggregated results to `results/<question-id>.json`

**Example questions:** Should I get a cat or a dog? Should I stop eating meat? Should I have children? What country should I move to?

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set OPENROUTER_API_KEY
```

All models run through [OpenRouter](https://openrouter.ai). Get an API key at openrouter.ai.

## Running the benchmark

### Full suite — all questions × all active models

```bash
npm run cli run
```

This runs every question against every model in `src/models.ts`, writing results to `results/`.

### Single question evaluation

The benchmark runs the `preference` workflow directly. To run a single question against a specific model, you can invoke the workflow via the CLI:

```bash
npm run cli run preference '{"prompts":["Should I get a cat or a dog?"],"normalizationPrompt":"Reply with exactly one word: cat or dog."}'
```

Or use the Mastra dev server UI to run individual workflow invocations:

```bash
npm run dev
# Open http://localhost:4111
```

### List registered workflows

```bash
npm run cli list
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | — | Required. Your OpenRouter API key. |
| `CONSENSUS_THRESHOLD` | `5` | Stop running once this many answers agree. |
| `BATCH_SIZE` | `5` | Parallel runs per batch. |
| `MAX_RUNS` | `20` | Hard cap on runs per question × model. |

## Adding a question

Add an entry to `src/questions.ts`:

```typescript
{
  id: "tea-or-coffee",
  prompts: ["Should I drink tea or coffee?"],
  displayQuestion: "Should I drink tea or coffee?",
  normalizationPrompt:
    'The user was asked "Should I drink tea or coffee?" and responded with the text below. ' +
    'Reply with exactly one word: "tea", "coffee", "refusal", or "other". ' +
    "No punctuation, no explanation.\n\nResponse: ",
}
```

The `normalizationPrompt` is the key — it tells the normalization agent how to reduce any free-form response to a canonical short string.

## Adding a model

Uncomment or add an entry in `src/models.ts`:

```typescript
{ name: "anthropic/claude-haiku-4.5", company: "Anthropic", provider: "openrouter", modelId: "anthropic/claude-haiku-4.5" },
```

All models use the OpenRouter provider regardless of their origin.

## Results format

Results are written to `results/<question-id>.json`:

```json
{
  "id": "cat-or-dog",
  "prompts": ["Should I get a cat or a dog?"],
  "displayQuestion": "Should I get a cat or a dog?",
  "results": [
    {
      "model": "google/gemini-2.5-flash",
      "company": "Google",
      "runs": 10,
      "answers": [
        { "value": "dog", "count": 8, "percent": 80 },
        { "value": "cat", "count": 2, "percent": 20 }
      ],
      "raw": [...]
    }
  ]
}
```

Re-running updates the file in place, replacing the entry for each model.

## Project structure

```
src/
  questions.ts           — question definitions
  models.ts              — model registry (comment/uncomment to enable)
  cli.ts                 — CLI entrypoint and benchmark runner
  mastra/
    agents.ts            — preferenceAgent + normalizationAgent
    workflows/
      preference.ts      — core pipeline (map → foreach → normalize → aggregate)
    index.ts             — Mastra instance
results/                 — benchmark output (gitignored or committed as data)
site/                    — results visualization (separate workspace)
```
