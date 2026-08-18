---
title: RLHF Playground
description: "The full alignment pipeline at toy scale — SFT, reward modeling, PPO and DPO on a GPT-2-class model."
type: project
level: advanced
status: experimented
tags:
  - alignment
  - rlhf
  - implementation
tech:
  - PyTorch
  - TRL
  - Weights & Biases
updated: 2026-02-04
created: 2026-01-08
---

# RLHF Playground

An end-to-end reproduction of the alignment pipeline on a 124M-parameter base: [[instruction-tuning|SFT]] → reward model → [[rlhf|PPO]], with [[dpo|DPO]] run as the control arm. Small enough to iterate daily, faithful enough that the failure modes match the literature.

## Pipeline

```
gpt2-small
   ├─ SFT on 8k curated instruction pairs
   ├─ RM: pairwise Bradley–Terry on 20k comparisons
   ├─ PPO: reward vs KL-to-SFT, β = 0.1
   └─ DPO: same preference data, supervised loss
```

## Comparison at Equal Preference Data

| Arm | Win-rate vs SFT (GPT-4 judge) | Mean reward | KL drift |
| --- | --- | --- | --- |
| PPO | 58% | 2.41 | 9.8 |
| DPO | 55% | 2.28 | 6.1 |
| SFT baseline | — | 1.62 | 0 |

> [!warning] Reproduced honestly
> PPO won slightly on quality and lost badly on *stability*: three of ten runs reward-hacked (sycophantic padding). DPO was boring and reliable — matching exactly the practitioner lore in [[direct-preference-optimization]].

## Implementation Notes

```python
# DPO arm: the entire "RL" in one loss
logits_w = logp(model, chosen) - logp(ref, chosen)
logits_l = logp(model, rejected) - logp(ref, rejected)
loss = -F.logsigmoid(beta * (logits_w - logits_l)).mean()
```

- Four models in VRAM for PPO forced 8-bit quantization of the reference — it worked fine.
- Reward hacking appeared as *length*: the reward model loved verbose answers. Adding a length penalty term bought back honesty cheaply.

## What I Learned

- The KL penalty is the alignment dial; β = 0.1 is a real phase transition, not a hyperparameter.
- Preference *data* quality swamps algorithm choice at this scale.
- [[pretraining]] quality sets the ceiling: SFT cannot teach what the base never saw.

## Connections

Uses [[rlhf]], [[dpo]], [[instruction-tuning]], [[pretraining]]; validates claims from [[direct-preference-optimization]].
