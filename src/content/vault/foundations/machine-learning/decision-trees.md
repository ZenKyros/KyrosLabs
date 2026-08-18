---
title: Decision Trees
description: "Recursive partitions, entropy and ensembles — interpretable models that ask questions."
type: concept
level: beginner
status: implemented
tags:
  - machine-learning
  - trees
prerequisites:
  - classification
updated: 2025-11-25
---

# Decision Trees

Models you can *read*: a cascade of yes/no questions that partitions feature space into rectangles.

## Splitting on Information Gain

A good split makes children purer than the parent. Purity is measured with entropy from [[probability]]:

$$
H(S) = -\sum_{c} p_c \log_2 p_c
$$

The split that maximizes

$$
\text{Gain}(S, A) = H(S) - \sum_{v} \frac{|S_v|}{|S|} H(S_v)
$$

wins. CART uses the closely related **Gini impurity** $G = 1 - \sum_c p_c^2$.

## Strengths and Weaknesses

| Pro | Con |
| --- | --- |
| Interpretable | High variance |
| No feature scaling needed | Axis-aligned splits |
| Handles mixed types | Greedy, suboptimal |

> [!note] The variance problem
> A single tree memorizes its training data — tiny perturbations grow into very different trees. Ensembling is the standard fix.

## Ensembles

- **Bagging → random forests**: average many decorrelated trees.
- **Boosting → XGBoost, LightGBM**: each new tree fits the *residual mistakes* of the ensemble so far.

Boosted trees remain the default for tabular data — often beating neural nets there.

## Connections

- Purity measures come from [[probability]].
- The "specialist vs committee" tension reappears in multi-agent designs and mixture-of-experts routing — see my research note on [[latent-reasoning]].
