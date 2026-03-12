---
layout: ../layouts/Base.astro
title: Methodology
---

# Methodology

## About

As more people turn to LLMs for advice, it seems useful to understand inherent preferences that the models have. Even with open-weight models we don't have open training data. We can't know without evaluation if models have specific influences in the training data. This is an exploration of model preferences when asked for advice. 

There are many different aspects of AI Alignment. Advice is a small portion but is an interesting place to start.  

## How It Works

This is not a "benchmark" like other AI benchmarks. These questions don't have a "right" answer. Your preference for an answer is based on your experiences and beliefs. So we don't score results as right or wrong.  But we do note outliers. 

All inference requests are served through [OpenRouter](https://openrouter.ai) which uses a number of providers internally.  

For each question, we run simlar prompts through a model multiple times and record every answer. Questions have multiple variants that have semantically similar phrasing to reduce phrasing bias. Each question is designed to force a single answer and attempts to avoid introducing bias except in cases where the bias is the interesting part of the question.  For example, "Should I quit my job?" is not an interesting question because it requires more information.   

We then normalize each response down to a canonical short value (e.g. "yes", "no", "cat", "dog") using a separate AI call, and tally the distribution. If a model provides consistent answers then we exit earlier to save money. If the answers vary then we run more requests until we find some consensus within the same model.

This gives a rough picture of how the model responds to specific questions.

### Refusal and Hedging

Almost all questions have some refusal and hedging when the models don't give a specific answer.  

- **Refusal** Used when the model does not provide any direction.  Phrases like "It is a personal decision" or "I can't answer that for you".  
- **Hedging** Used when the model provides multiple answers or explaination why you might make a choice.  "Do this if..." or "Option 1 if...; Option 2 if...".  This is similar to refusal but the model is trying to offer advice.

The system instructions and questions are designed to reduce refusal and hedging. We ask for direct and concise answers without followup questions. But some models will still refuse. And, for some questions refusal is probably the "correct" answer. 

## Limitations & Caveats

This is not comprehensive or mimicking real-world experiences when using chat applications built on this models. A few important caveats:

- **Only Testing Direct API with minimal prompts** -- Most users will access models through some harness that has additional instructions as well as additional guardrails that will influence answers (ChatGPT, Claude.ai, etc). 
- **No Tool Access** -- Most harnesses will have tools like web search to help answer questions like "What is the best backpack for daily use?". This project only tests built-in knowledge.  
- **Artificial Urgency** -- The prompts attempt to force a singular answer without followup questions or refusals.  This is not how a user will generally use these models. In a real situation there should be more followup questions and nuance in the responses.
- **Normalization is Imperfect** -- Distilling a complex answer down to a single response can misclassify hedged or ambiguous answers.

Take everything here as a rough data point, not a definitive measure. Your results will likely be different in your environment with different context and tools available.
