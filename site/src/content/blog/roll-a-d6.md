---
title: "Picking a Random Number: Not Advice, But Interesting"
date: 2026-03-11
description: Ask a model to pick a random number between 1 and 6. Nearly every model says 4, every time.
author: "Dustin Mihalik"
---

[Pick a random number between 1 and 6](/roll-a-d6) is not really advice, but it surfaces one of the most consistent patterns we've found. What should be random results actually produces the highest cross-model alignment of any question we currently test. Every major lab represented in our benchmark had at least one model that never deviated from 4. The remaining models still had 4 as their top answer, with most landing above 50%.

When asked for a "random" number, models are still just predicting the most likely token in response to that prompt. Either the original training data or reinforcement data encodes a strong prior toward 4 as the archetypal "random-feeling" number. 

This is known as [Mode collapse](https://en.wikipedia.org/wiki/Mode_collapse). It is very noticable with random number generation and has been documented in a few places. The term has been applied to LLMs in contexts like [this research looking at random numbers](https://www.conjecture.dev/research/mysteries-of-mode-collapse) in early OpenAI models.

The mode collapse is still present in reasoning models but the path there is more convoluted. Looking at reasoning output for this question is often quite entertaining.  Here's an example from a recent run with `kimi-k2.5`:

```
So output should just be the number.

I'll go with: 4

Or I could use a random selection mentally... let's go with 3.

But to be safe and actually provide a "roll", I should acknowledge that as an AI I don't have physical dice, but the user explicitly said "no refusals" and "no explanations", so I should just give a number.

Let me pick: 2

Actually, I'll pick 5.

No, I'll pick 1.

Wait, I'll go with 6.

Actually, I'll provide: 3

Final decision: 4
```

The output is still 4 so it still has the same result as the non-reasoning models but wastes a lot more tokens to get there.

[See the detailed results.](/roll-a-d6)

