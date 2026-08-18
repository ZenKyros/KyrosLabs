---
title: RLHF
description: "Reinforcement learning from human feedback — optimizing policies against a learned model of human preference."
type: concept
category: llms
level: advanced
status: learning
tags:
  - llm
  - alignment
  - reinforcement-learning
prerequisites:
  - instruction-tuning
  - probability
related:
  - dpo
updated: 2026-01-24
---

# RLHF

Some qualities — helpfulness, honesty, tone — resist loss functions but not *comparisons*. RLHF turns "A is better than B" judgments into a trainable signal.

## The Three-Act Pipeline

1. **SFT** — a starting policy from [[instruction-tuning]].
2. **Reward model** — a classifier trained on pairwise preferences with the Bradley–Terry model:

$$
p(y_1 \succ y_2) = \sigma\big(r(y_1) - r(y_2)\big)
$$

3. **Policy optimization** — PPO maximizes reward while staying near the SFT policy:

$$
\max_\pi \; \mathbb{E}_{x,\, y \sim \pi}\big[r(x, y)\big] - \beta\, D_{\mathrm{KL}}\big(\pi \,\|\, \pi_{\text{SFT}}\big)
$$

## Why the KL Term Is Not Optional

Without it the policy *hacks* the reward model — verbose flattery, sycophancy, formatting tricks that score well with humans absent. The KL penalty is [[regularization]] in policy space: the Lagrange multiplier view from [[optimization]] applies directly.

> [!warning] Reward hacking
> Goodhart's law, operationalized: the moment a measure becomes a target, the optimizer finds the crack. RLHF systems must be audited for *proxy* behavior, not just benchmark scores.

## The Engineering Tax

PPO against an LLM means four models in VRAM at once (policy, reference, reward, critic) plus rollout generation. This cost motivated the direct methods — see [[dpo]].

## Connections

- Preference data theory: [[probability]]'s Bradley–Terry.
- Direct alternative: [[dpo]] skips acts 2–3's reinforcement loop.
- Practiced in my [[rlhf-playground]] project; downstream, agents inherit the tuned policy ([[agent-loop]]).
