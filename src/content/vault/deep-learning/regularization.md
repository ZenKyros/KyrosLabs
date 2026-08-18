---
title: Regularization
description: "Trading fit for generalization — penalties, dropout and the bias-variance dial."
type: concept
category: deep-learning
level: intermediate
status: understood
tags:
  - deep-learning
  - generalization
prerequisites:
  - neural-networks
related:
  - probability
updated: 2025-12-14
---

# Regularization

A model that fits the training data perfectly has learned nothing if it fails on new data. Regularization constrains the hypothesis space on purpose.

## Weight Decay (L2)

Add the squared norm of the weights to the loss:

$$
\mathcal{L}_{\text{reg}} = \mathcal{L} + \lambda \|w\|_2^2
$$

Bayesian reading from [[probability]]: it is a Gaussian *prior* on the weights — MAP instead of plain ML.

## Dropout

At training time, randomly zero each unit with probability $p$:

```python
nn.Dropout(p=0.1)   # transformers typically use 0.1
```

The network can no longer rely on any single pathway; it learns redundant, robust features. At inference the surviving weights are scaled — dropout is really training an *ensemble* of $2^n$ subnetworks at once.

## Other Levers

- **Early stopping** — validation loss as the brake.
- **Data augmentation** — enlarge the dataset artificially.
- **Label smoothing** — soften one-hot targets.
- **Batch size & learning-rate interplay** — big batches generalize differently.

> [!warning] The modern twist
> Huge pretrained models are often *under-regularized by design*: they are trained on so much data that overfitting inverts into in-context generalization. Fine-tuning ([[instruction-tuning]]) then uses small learning rates and little data — regularization pressure returns.

## Connections

- The bias-variance tradeoff is pure [[probability]].
- [[rlhf]]'s KL penalty is regularization of a *policy*, not weights.
