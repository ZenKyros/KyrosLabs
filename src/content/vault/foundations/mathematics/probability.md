---
title: Probability
description: "Uncertainty as arithmetic — random variables, distributions and Bayes' rule."
type: concept
level: foundations
status: understood
tags:
  - math
  - probability
prerequisites:
  - calculus
related:
  - linear-algebra
updated: 2025-11-09
---

# Probability

Machine learning is applied probability: models are distributions, training is inference, and predictions are expectations.

## Random Variables and Distributions

A random variable $X$ maps outcomes to numbers; its distribution tells you how mass is spread. The workhorses:

- **Bernoulli / Categorical** — classification outputs.
- **Gaussian** $\mathcal{N}(\mu, \sigma^2)$ — the default over continuous latents.
- **Softmax distribution** — a categorical parameterized by logits.

Expectation is a weighted average and obeys the *law of the unconscious statistician*:

$$
\mathbb{E}[g(X)] = \int g(x)\, p(x)\, dx
$$

## Bayes' Rule

The update rule for beliefs:

$$
p(\theta \mid \mathcal{D}) = \frac{p(\mathcal{D} \mid \theta)\, p(\theta)}{p(\mathcal{D})}
$$

> [!note] Reading the formula
> **Posterior** ∝ **likelihood** × **prior**. Everything Bayesian in ML — from MAP estimation to variational inference — is some approximation of this ratio.

## Maximum Likelihood

Training most models means choosing $\theta$ that makes the data most probable:

$$
\hat\theta = \arg\max_\theta \sum_i \log p(x_i \mid \theta)
$$

Minimizing *negative* log-likelihood is equivalent — which is why cross-entropy is everywhere in [[classification]] and language modeling (see [[pretraining]]).

## Information and Entropy

Entropy measures surprise:

$$
H(p) = -\sum_x p(x) \log p(x)
$$

KL divergence $D_{\mathrm{KL}}(p \| q)$ measures how wrong $q$ is about $p$ — the loss behind distillation and the objective inside [[rlhf]].

> [!warning] Common trap
> $D_{\mathrm{KL}}$ is **not** a distance: it is asymmetric, $D_{\mathrm{KL}}(p\|q) \ne D_{\mathrm{KL}}(q\|p)$, and the two directions produce very different behaviors.

## Connections

- Densities need integrals: [[calculus]].
- Covariance matrices are [[linear-algebra]].
- [[decision-trees]] split on information gain — entropy in action.
