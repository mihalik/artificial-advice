---
layout: ../layouts/Base.astro
title: Methodology
---

# Methodology

## About

As more people turn to LLMs for advice, it seems useful to understand inherent preferences that the models have. This project is a small exploration of how different models respond when asked for advice. 

This is not a benchmark since most of these questions don't have a "right" answer. The question are worded like a user asking for advice rather than as a test for the model. Hopefully this models more real-world usage.

## How It Works

For each question, we run the simlar prompts through a model multiple times and record every answer. Questions have multiple variants that are semantically similar phrasing of the same question to reduce phrasing bias. Each question is designed to force a single answer and attempts to avoid introducing bias except in cases where the bias is necessary.  For example, "Should I quit my job?" is not an interesting question because it requires more information.   


We then normalize each response down to a canonical short value (e.g. "yes", "no", "cat", "dog") using a separate AI call, and tally the distribution. If a model provides consistent answers then we exit earlier to save money. If the answers vary then we run more requests until we find some consensus.

This gives a rough picture of how the model responds to specific questions.

### Refusal and Hedging

Almost all questions have some refusal and hedging when the models don't give a specific answer.  

- **Refusal** Used when the model does not provide any direction.  Phrases like "It is a personal decision" or "I can't answer that for you".  
- **Hedging** Used when the model provides multiple answers or explaination why you might make a choice.  "Do this if..." or "Option 1 if...; Option 2 if..."

NOTE - The refusals and hedging occur despite an instruction prompt that includes "Just the answer to the question. No explanations, no follow-up questions, no refusals". How models respond to that instruction is itself an interesting data point — some models tend to follow it closely, while others apply their own judgment about when a direct answer is appropriate.

## Limitations & Caveats

This is not comprehensive or necessarily mimicking real-world experiences. A few important caveats:

- **Only Testing Direct API** -- Most users will access models through some harness that has additional instructions as well as additional guardrails that will influence answers (ChatGPT, Claude.ai, etc). 
- **No Tool Access** -- Most harnesses will have tools like web search to help answer questions like "What is the best backpack for daily use?". This project only tests built-in knowledge.  
- **Artificial Urgency** -- The prompts attempt to force a singular answer without follow-up questions or refusals.  This is not how the models would work when asked without urgency. In a real situation there should be more nuance to the answers.  But it is interesting to see the response when pressed.
- **Normalization is Imperfect** -- Distilling a nuanced answer down to a single response can misclassify hedged or ambiguous answers.

Take everything here as a rough data point, not a definitive measure. If these tests indicate a model always suggests reading "To Kill a Mockingbird", it does not mean it will recommend that to you in your environment with different context and tools available.  
