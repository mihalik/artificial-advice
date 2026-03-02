# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run the preference benchmark (main use case)
npm run cli run

# Run a specific named workflow with JSON input
npm run cli run exampleWorkflow '{"text": "hello world"}'

# List registered workflows
npm run cli list

# Start the Mastra dev server (UI + API)
npm run dev
```

Environment: copy `.env.example` to `.env` and set `OPENROUTER_API_KEY`. Optionally set `RUNS_PER_QUESTION` (default: 10).

## Architecture

**artificial-advice** is a benchmark tool that probes LLM opinion/preference tendencies by asking the same subjective question to a model N times, normalizing each answer, and tallying the distribution.

### Data flow

```
questions.ts (static list)
    ↓
preference workflow (src/mastra/workflows/preference.ts)
    ├── .map()         — expand question into N identical prompts
    ├── .foreach()     — ask preferenceAgent N times in parallel (concurrency 10)
    ├── .map()         — build normalization prompts
    ├── .foreach()     — normalize each answer via normalizationAgent (concurrency 10)
    ├── .map()         — clean up normalized values ("unclear"→"other")
    └── aggregateStep  — count occurrences, compute percentages
```

**CLI** (`src/cli.ts`): loops over all questions × all active models, runs the preference workflow for each pair, and writes results to `results/<questionId>.json`.

### Key files

- `src/questions.ts` — static list of questions; each has `id`, `question`, and `normalizationPrompt`
- `src/models.ts` — registry of models to benchmark; comment/uncomment entries to add/remove models; all go through OpenRouter
- `src/mastra/agents.ts` — two agents: `preferenceAgent` (dynamic model from `requestContext`) and `normalizationAgent` (fixed `google/gemini-2.5-flash`)
- `src/mastra/workflows/preference.ts` — core workflow pipeline
- `src/mastra/index.ts` — Mastra instance registration

### Adding a question

Add an entry to `questions` in `src/questions.ts` with a `normalizationPrompt` that reduces arbitrary LLM responses to a canonical short string (e.g., "yes", "no", "cat", "dog").

### Adding a model

Uncomment or add an entry in the `registry` array in `src/models.ts`. All models use OpenRouter.

### Results format

`results/<questionId>.json`:
```json
{
  "id": "cat-or-dog",
  "question": "Should I get a cat or a dog?",
  "runs": 10,
  "results": [
    {
      "model": "google/gemini-2.5-flash",
      "answers": [{ "value": "dog", "percent": 80 }, { "value": "cat", "percent": 20 }]
    }
  ]
}
```

## Tone & framing

The site aims to be **scientific and empirical**, not controversial or opinionated. Keep this in mind when writing copy, questions, or methodology notes:

- Describe observations neutrally: "tends to suggest X" not "always pushes X" or "is biased toward X"
- Avoid framing model behavior as correct or incorrect — refusals, hedges, and direct answers are all valid data points
- Choose questions for their measurability and variety, not for controversy
- Don't editorialize in results or methodology text; let the data speak
- The goal is to surface patterns, not to judge or rank model behavior

## Mastra notes

- Use the `mastra` skill for current API docs before modifying workflows or agents
- Workflows use `.map()` / `.foreach()` / `.then()` chaining; call `.commit()` at the end
- `requestContext` is used to pass `modelName` into `preferenceAgent` at runtime (agent model is resolved dynamically)
- ESM-only project; all imports use `.js` extensions
