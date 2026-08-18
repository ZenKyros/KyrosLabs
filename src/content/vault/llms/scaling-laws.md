---
title: Scaling Laws
description: "Power laws between compute, data, parameters and loss — the physics of large models."
type: concept
category: llms
level: advanced
status: learning
tags:
  - llm
  - scaling
prerequisites:
  - pretraining
related:
  - rlhf
papers:
  - gpt-3
updated: 2026-01-20
---

# Scaling Laws

Before spending $100M on a training run, you would like to know what it buys. Scaling laws say: loss falls as a *power law* of model size, data size and compute — smooth, predictable, and sobering.

## The Kaplan / Hoffmann Form

$$
L(N, D) \approx E + \frac{A}{N^{\alpha}} + \frac{B}{D^{\beta}}
$$

with $\alpha \approx 0.34$, $\beta \approx 0.28$ — diminishing returns with exponents well below one.

## Chinchilla's Correction

DeepMind re-ran the experiments with more, smaller runs and overturned the convention: **parameters and tokens should grow together**, roughly 20 tokens per parameter.

| Model | Params | Tokens | Verdict |
| --- | --- | --- | --- |
| GPT-3 | 175B | 300B | under-trained |
| Chinchilla | 70B | 1.4T | matched |
| LLaMA-2 7B | 7B | 2T | deliberately over-trained |

Over-training past Chinchilla-optimal trades *training efficiency* for *inference efficiency* — small, well-fed models serve cheaper.

> [!warning] What the laws do NOT predict
> Loss is smooth; capabilities are not. Few-shot arithmetic and chain-of-thought appear as phase transitions the power law never hints at. Scaling laws tell you the bill, not the menu.

## Implications I Track

1. **Compute-optimal frontier** keeps moving — data is becoming the binding constraint (synthetic data research, see [[speculative-decoding|efficiency]] threads).
2. **Inference dominates cost** at deployment — motivates distillation and KV-cache tricks ([[multi-head-attention|GQA]]).
3. Alignment must not regress while scaling: [[rlhf]] at scale is its own research area.

## Connections

- Empirics started with [[gpt-3]]; corrected by the Chinchilla paper.
- Governs every decision in [[pretraining]].
