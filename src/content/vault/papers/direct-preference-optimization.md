---
title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model"
description: "Rafailov et al., 2023 — collapsing RLHF's RL loop into a single supervised loss."
type: paper
authors:
  - Rafailov
  - Sharma
  - Mitchell
  - Ermon
  - Manning
  - Finn
year: 2023
venue: NeurIPS 2023 (Outstanding Paper)
url: https://arxiv.org/abs/2305.18290
topics:
  - alignment
  - preference-learning
concepts:
  - dpo
  - rlhf
tags:
  - alignment
  - finetuning
status: learning
updated: 2026-02-06
---

# Direct Preference Optimization

## Why This Paper Matters

Alignment at scale was bottlenecked by PPO infrastructure. DPO showed the bottleneck was *mathematical, not fundamental*: the constrained reward objective admits a closed-form policy, and substituting it back yields a supervised loss. Overnight, alignment research democratized to anyone with a trainer script.

## Core Idea

Start from the [[rlhf]] objective

$$
\max_\pi \mathbb{E}[r(x,y)] - \beta D_{\mathrm{KL}}(\pi \| \pi_{\text{ref}})
$$

whose optimum is known in closed form. Rearrange to express $r$ as a function of $\pi$, plug into the Bradley–Terry preference model, and train directly:

$$
\mathcal{L}_{\text{DPO}} = -\log \sigma\!\left(\beta \log \tfrac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \tfrac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)
$$

## The Trick, Slowly

1. KL-constrained optimization → optimal policy is an *exponential tilt* of the reference.
2. The tilt is invertible → reward = $\beta \log(\pi/\pi_{\text{ref}}) + \text{const}$.
3. Preferences compare *differences* of rewards → the partition function cancels.
4. What remains is logistic regression on log-ratio differences. Trainable with Adam.

## My Understanding

The paper is a lesson in re-parameterization: the "RL" in RLHF was solving an optimization whose answer was already known. What remains genuinely online — exploration beyond the preference dataset — is exactly where DPO is weakest, and where later work (IPO, KTO, online variants) focuses.

> [!warning] Practitioner's caveat
> DPO drives down the likelihood of *both* responses early in training; if the chosen response's likelihood collapses too, generations degrade. Watch $\log \pi(y_w)$, not just the loss.

## Implementation

About forty lines on top of an SFT trainer — my [[rlhf-playground]] implements the exact loss above with a frozen reference model.

## Related Concepts

[[dpo]] · [[rlhf]]

## Follow-up Papers

- IPO, KTO, ORPO — relaxing the Bradley–Terry assumption.
- Online DPO / iterative DPO — restoring exploration.
