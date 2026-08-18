---
title: Classification
description: "Decision boundaries, logistic regression and cross-entropy — predicting discrete outcomes."
type: concept
level: beginner
status: implemented
tags:
  - machine-learning
  - supervised
prerequisites:
  - regression
  - probability
related:
  - decision-trees
updated: 2025-11-21
---

# Classification

Instead of a number, predict a *label*. The core move: turn scores into probabilities.

## Logistic Regression

Squash a linear score into $(0, 1)$ with the sigmoid:

$$
p(y=1 \mid x) = \sigma(w^\top x + b) = \frac{1}{1 + e^{-(w^\top x + b)}}
$$

Despite the name it is a classifier — and it is still the final layer of most binary models.

## Cross-Entropy Loss

The negative log-likelihood of the correct class:

$$
\mathcal{L} = -\sum_{i} \Big[ y_i \log \hat p_i + (1 - y_i)\log(1 - \hat p_i) \Big]
$$

For $K$ classes, softmax + categorical cross-entropy. This exact pairing survives unchanged into [[pretraining|language-model pretraining]], where the "correct class" is the next token.

## Decision Boundaries

A linear classifier carves space with a hyperplane $w^\top x + b = 0$. Non-linear boundaries need either:

1. **feature maps** (kernels, polynomial features), or
2. **learned features** — the deep-learning answer, see [[neural-networks]].

> [!tip] Calibration
> Cross-entropy trains models to output *probabilities*, not just decisions. Well-calibrated scores matter whenever a downstream system thresholds them — from medical triage to [[rlhf]] reward models.

## Beyond Two Classes

- **One-vs-rest** — $K$ binary problems.
- **Softmax** — one multiclass distribution (the standard).
- **Tree-based** — partition space geometrically: [[decision-trees]].

## Connections

Built on [[regression]]'s machinery and [[probability]]'s likelihood principle; extended by [[decision-trees]] and eventually by neural classifiers ([[cnn]] for images).
