---
title: DPO
description: "Direct Preference Optimization — the RLHF objective, solved in closed form as supervised learning."
type: concept
category: llms
level: advanced
status: learning
tags:
  - llm
  - alignment
  - preference-learning
prerequisites:
  - rlhf
related:
  - instruction-tuning
papers:
  - direct-preference-optimization
updated: 2026-02-08
---

# DPO

[[rlhf|RLHF]] works but is an engineering ordeal: reward model, PPO, rollouts, four models in memory. **Direct Preference Optimization** ([Rafailov et al., 2023](https://arxiv.org/abs/2305.18290)) asks: can we skip the reinforcement learning entirely?

## The Derivation in One Move

The KL-constrained reward objective has a *known* optimal policy:

$$
\pi^\star(y \mid x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y \mid x)\, \exp\!\left(\frac{1}{\beta} r(x, y)\right)
$$

Invert this relationship to express the reward *in terms of the policy*, substitute into Bradley–Terry, and the whole problem becomes a binary logistic loss over preference pairs:

$$
\mathcal{L}_{\text{DPO}} = -\mathbb{E}_{(x, y_w, y_l)} \log \sigma\!\left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right)
$$

No reward model. No rollouts. Just two forward passes per example — supervised learning infrastructure only.

## DPO vs RLHF, Practically

| | RLHF (PPO) | DPO |
| --- | --- | --- |
| Models in memory | 4 | 2 |
| Stability tuning | heavy | light |
| Exploration | online | offline |
| Failure mode | reward hacking | likelihood drift |

> [!note] The catch
> DPO is *offline*: it cannot query the preference model on new behavior, so it can overfit to the preference dataset's distribution. Iterative/online variants (IPO, KTO, online DPO) exist precisely to close this gap.

## Connections

- The paper itself: [[direct-preference-optimization]].
- Replaces the middle of the [[rlhf]] pipeline; starts from [[instruction-tuning]].
- Implemented end-to-end in my [[rlhf-playground]] project.
