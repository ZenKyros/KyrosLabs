---
title: "Language Models are Few-Shot Learners"
description: "GPT-3 — 175 parameters, zero fine-tuning, and the discovery that scale buys in-context learning."
type: paper
authors:
  - Brown
  - Mann
  - Ryder
  - Subbiah
  - Kaplan
year: 2020
venue: NeurIPS 2020
url: https://arxiv.org/abs/2005.14165
topics:
  - scaling
  - in-context-learning
  - llm
concepts:
  - pretraining
  - scaling-laws
  - tokenization
tags:
  - landmark
  - llm
status: understood
related:
  - bert
updated: 2025-12-27
---

# GPT-3

## Why This Paper Matters

GPT-3 changed the question from *"can we fine-tune a model per task?"* to *"what can one model do with only a prompt?"* It made **in-context learning** — task specification by example, no gradient updates — a phenomenon demanding explanation, and it set the scale agenda for the decade.

## Core Idea

Train an autoregressive decoder ([[transformers]], causal masking) on ~300B tokens and evaluate it three ways:

| Regime | Gradient updates | Examples in prompt |
| --- | --- | --- |
| Zero-shot | none | none |
| One-shot | none | 1 |
| Few-shot | none | 10–100 |

No fine-tuning anywhere. The task is *described*, not trained.

## Scale as the Independent Variable

Eight model sizes from 125M to 175B parameters, all on the same data and schedule. Smooth power laws in perplexity ([[scaling-laws]]), but *discontinuous* capability jumps: arithmetic, word unscrambling, saturation of benchmarks appear only past certain sizes.

> [!note] The uncomfortable footnote
> Emergent capabilities are unpredictable from the loss curve. The paper's most lasting contribution may be methodological: measure many sizes, same recipe, and let the curve talk.

## Mathematics

Pure autoregressive likelihood — the same objective as [[pretraining]], just bigger:

$$
p(x) = \prod_{t} p_\theta(x_t \mid x_{<t})
$$

## My Understanding

GPT-3 reframes a language model as a *general-purpose inference engine*: the prompt selects a program that was already implicit in the weights. Everything after — [[instruction-tuning]], [[rlhf]], agents ([[agent-loop]]) — is about steering that engine safely.

## Implementation

I have not trained anything near 175B, but my [[nano-transformer]] reproduces the architecture family at toy scale, and [[rlhf-playground]] fine-tunes GPT-2-class checkpoints downstream of this lineage.

## Related Concepts

[[pretraining]] · [[scaling-laws]] · [[tokenization]]

## Follow-up Papers

- [[direct-preference-optimization]] — alignment methods built for this scale regime.
- The InstructGPT work (not yet in vault) — RLHF applied to GPT-3.
