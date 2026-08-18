---
title: Pretraining
description: "Next-token prediction at planetary scale — the single task that bootstraps general intelligence-ish behavior."
type: concept
category: llms
level: advanced
status: learning
tags:
  - llm
  - pretraining
  - training
prerequisites:
  - transformers
  - tokenization
related:
  - scaling-laws
  - instruction-tuning
papers:
  - gpt-3
updated: 2026-01-18
---

# Pretraining

Pretraining teaches a [[transformers|transformer]] to model language by predicting the next [[tokenization|token]], over trillions of tokens of raw text. No labels, no rewards — just the relentless statistics of what comes next.

## The Objective

Maximize the log-likelihood of the corpus under an autoregressive factorization:

$$
\mathcal{L} = -\sum_{t} \log p_\theta(x_t \mid x_{<t})
$$

> [!note] Why this boring task works
> To predict the next token well, the model must implicitly learn syntax, facts, planning and even theory of mind — whatever regularities reduce surprise. The loss is a compression objective; intelligence is the side effect of compressing the web.

## The Data Flywheel

| Stage | What matters |
| --- | --- |
| Collection | Common Crawl-scale crawls |
| Filtering | dedupe, quality classifiers, PII removal |
| Mixing | domain ratios (web, books, code, math) |
| Scheduling | upsample high-quality data late |

Data quality dominates: models trained on filtered data beat larger models trained on raw crawls.

## The Training Recipe

```python
# the whole loop, spiritually
for batch in corpus:
    logits = model(batch[:, :-1])
    loss = F.cross_entropy(logits.flatten(0, 1), batch[:, 1:].flatten())
    loss.backward(); optimizer.step(); scheduler.step()
```

Real recipes add: AdamW with cosine decay + warmup, gradient clipping, mixed precision, tensor/pipeline parallelism, and checkpoint surgery. See [[gpt-3]] for the canonical writeup.

## Emergent After-Effects

Capabilities appear discontinuously with scale — few-shot learning, arithmetic, chain-of-thought. [[scaling-laws]] predicts the *loss*; the *capabilities* still surprise.

## Connections

- Continues into [[instruction-tuning]] → [[rlhf]] → [[dpo]].
- Economics ruled by [[scaling-laws]]; my [[rlhf-playground]] starts from a pretrained checkpoint.
- Open research thread: [[latent-reasoning]] asks what pretraining *fails* to learn.
