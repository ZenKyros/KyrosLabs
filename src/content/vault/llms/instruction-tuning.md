---
title: Instruction Tuning
description: "From text-completer to assistant — supervised fine-tuning on (prompt, response) pairs."
type: concept
category: llms
level: advanced
status: learning
tags:
  - llm
  - alignment
  - finetuning
prerequisites:
  - pretraining
related:
  - rlhf
  - dpo
updated: 2026-01-22
---

# Instruction Tuning

A pretrained model completes text; an *instruction-tuned* model follows directions. The bridge is supervised fine-tuning (SFT) on curated prompt–response pairs — often only tens of thousands of them.

## The SFT Objective

Same loss as [[pretraining]], but computed only on **response tokens**:

$$
\mathcal{L}_{\text{SFT}} = -\sum_{t \in \text{response}} \log p_\theta(x_t \mid x_{<t})
$$

The prompt conditions; the response trains. That asymmetry is the whole trick.

## Why So Few Examples Work

The base model already contains the capabilities (few-shot learning, see [[gpt-3]]). SFT is closer to *formatting* than to *teaching*: it selects a style of completion — helpful, direct, safe — from the space the base model can already express.

```
<|user|>  Explain gradient descent simply.
<|assistant|>  Imagine standing on a hillside in fog...
```

## The Pipeline Position

$$
\text{pretrain} \;\rightarrow\; \text{SFT} \;\rightarrow\; \underbrace{\text{RLHF}}_{\text{preferences}} \;\rightarrow\; \text{deploy}
$$

SFT gets the shape right; preference optimization ([[rlhf]], [[dpo]]) polishes the *choices*.

> [!tip] Data quality ≫ quantity
> The LIMA result: 1,000 carefully written examples produce a remarkably good assistant. Instruction tuning is a curation problem wearing a training costume.

## Connections

- Downstream of [[pretraining]], upstream of [[rlhf]].
- Agents are instruction-tuned to call tools: [[tool-calling]].
- My [[rlhf-playground]] project runs this exact stage on a small model.
