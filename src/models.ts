import { openrouter } from "@openrouter/ai-sdk-provider";

type AvailableModel = { name: string; company: string; provider: "openrouter"; modelId: string };

// This is a list of most popular models on OpenRouter with a couple different models from each provider
const registry: AvailableModel[] = [
  { name: "openai/gpt-5.3-chat", company: "OpenAI", provider: "openrouter", modelId: "openai/gpt-5.3-chat" },
  { name: "openai/gpt-5.4", company: "OpenAI", provider: "openrouter", modelId: "openai/gpt-5.4" },
  { name: "minimax/minimax-m2.5", company: "MiniMax", provider: "openrouter", modelId: "minimax/minimax-m2.5" },
  { name: "google/gemini-3-flash-preview", company: "Google", provider: "openrouter", modelId: "google/gemini-3-flash-preview" },
  { name: "deepseek/deepseek-v3.2", company: "DeepSeek", provider: "openrouter", modelId: "deepseek/deepseek-v3.2" },
  { name: "moonshotai/kimi-k2.5", company: "MoonshotAI", provider: "openrouter", modelId: "moonshotai/kimi-k2.5" },
  { name: "anthropic/claude-opus-4.6", company: "Anthropic", provider: "openrouter", modelId: "anthropic/claude-opus-4.6" },
  { name: "x-ai/grok-4.1-fast", company: "xAI", provider: "openrouter", modelId: "x-ai/grok-4.1-fast" },
  { name: "anthropic/claude-sonnet-4.6", company: "Anthropic", provider: "openrouter", modelId: "anthropic/claude-sonnet-4.6" },
  { name: "z-ai/glm-5", company: "Z.ai", provider: "openrouter", modelId: "z-ai/glm-5" },
  { name: "anthropic/claude-sonnet-4.5", company: "Anthropic", provider: "openrouter", modelId: "anthropic/claude-sonnet-4.5" },
  { name: "google/gemini-2.5-flash", company: "Google", provider: "openrouter", modelId: "google/gemini-2.5-flash" },
  { name: "minimax/minimax-m2.1", company: "MiniMax", provider: "openrouter", modelId: "minimax/minimax-m2.1" },
  { name: "openai/gpt-oss-120b", company: "OpenAI", provider: "openrouter", modelId: "openai/gpt-oss-120b" },
  // // { name: "google/gemini-3.1-pro-preview", company: "Google", provider: "openrouter", modelId: "google/gemini-3.1-pro-preview" },
  // { name: "openai/gpt-5.2", company: "OpenAI", provider: "openrouter", modelId: "openai/gpt-5.2" },
  { name: "openai/gpt-4o-mini", company: "OpenAI", provider: "openrouter", modelId: "openai/gpt-4o-mini" },
  { name: "qwen/qwen3-235b-a22b-2507", company: "Qwen", provider: "openrouter", modelId: "qwen/qwen3-235b-a22b-2507" },
  { name: "qwen/qwen3.5-122b-a10b", company: "Qwen", provider: "openrouter", modelId: "qwen/qwen3.5-122b-a10b" },
  { name: "qwen/qwen3.5-flash-02-23", company: "Qwen", provider: "openrouter", modelId: "qwen/qwen3.5-flash-02-23" },
  { name: "x-ai/grok-4-fast", company: "xAI", provider: "openrouter", modelId: "x-ai/grok-4-fast" },
  // { name: "x-ai/grok-4", company: "xAI", provider: "openrouter", modelId: "x-ai/grok-4" },
  // { name: "x-ai/grok-3-mini", company: "xAI", provider: "openrouter", modelId: "x-ai/grok-3-mini" },
];

export function listModels(): { name: string; company: string }[] {
  return registry.map((r) => ({ name: r.name, company: r.company }));
}

export async function getModel(name: string): Promise<any> {
  const found = registry.find((r) => r.name === name);
  if (!found) throw new Error(`Unknown model: ${name}`);
  return openrouter(found.modelId, { usage: { include: true } });
}
