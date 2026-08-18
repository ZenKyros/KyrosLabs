---
title: Speculative Decoding Analysis
description: "When do draft-model bets pay off? A measurement-driven note on LLM inference acceleration."
type: research
level: advanced
status: research
hypothesis: "Draft acceptance rate — not draft speed — is the binding variable for speculative decoding gains, and it degrades predictably with sampling temperature."
tags:
  - research
  - inference
  - efficiency
updated: 2026-01-28
created: 2026-01-20
---

# Speculative Decoding Analysis

## Hypothesis

> Speculative decoding's speedup is governed by the *expected accepted prefix length* $E[L]$ of the draft model, and $E[L]$ falls with sampling temperature faster than greedy-vs-nucleus comparisons in the literature suggest.

## Motivation

Inference cost now dominates LLM economics ([[scaling-laws]] is a *training* law; serving has its own physics). Autoregressive decoding is memory-bandwidth bound: verifying $k$ candidate tokens costs about as much as generating one ([[tokenization|tokens]] share the KV-cache). If a small draft model is right often enough, throughput multiplies.

## Literature

- Leviathan et al. 2023 — exact sampling preservation via modified rejection.
- Chen et al. 2023 — the $E[L]$ speedup formula: speedup $\approx \frac{E[L] + 1}{1 + c \cdot E[L]}$ with $c$ the draft/target cost ratio.
- Medusa / EAGLE — self-drafting heads that skip the second model.

## Mathematical Formulation

Expected accepted length under draft $q$, target $p$:

$$
E[L] = \sum_{k \ge 1} \prod_{i=1}^{k} \mathbb{E}_{x \sim q}\!\left[\min\!\left(1, \frac{p(x)}{q(x)}\right)\right]
$$

The product structure is why acceptance *compounds* — one bad bet ends the run.

## Proposed Experiments

1. Fix target (7B), sweep draft sizes {68M, 160M, 410M}; measure $E[L]$ at $\tau \in \{0, 0.6, 1.0\}$.
2. Temperature sweep at fixed pair; fit the decay of $E[L](\tau)$.
3. Domain split: code vs prose vs chat — hypothesis says code accepts longer.

## Expected Results

Speedup curves should *cross*: large drafts win at $\tau=0$, small drafts win as temperature rises because their cheaper bets lose less per miss.

## Limitations

- Single target family; KV-cache effects ([[multi-head-attention|GQA]] models) may shift constants.
- Judging against wall-clock on one GPU generation; batched serving changes the arithmetic.

## Open Questions

- Can the draft be *adapted online* from rejected tokens — a [[memory]]-style feedback loop for inference?
- Does this connect to my [[nano-transformer]] KV-cache implementation? (It should — the verification pass reuses it.)

## Connections

Builds on [[pretraining]], [[tokenization]], [[scaling-laws]].
