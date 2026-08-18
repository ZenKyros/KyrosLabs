---
title: Regression
description: "Predicting continuous values — least squares, the normal equation and the first loss function."
type: concept
level: beginner
status: mastered
tags:
  - machine-learning
  - supervised
prerequisites:
  - linear-algebra
  - calculus
  - probability
related:
  - classification
updated: 2025-11-18
---

# Regression

The hello-world of learning from data: given inputs $x$, predict a continuous target $y$.

## The Linear Model

$$
\hat y = w^\top x + b
$$

Training means choosing $(w, b)$ that minimize the **mean squared error**:

$$
\mathcal{L}(w) = \frac{1}{n}\sum_{i=1}^{n} (w^\top x_i + b - y_i)^2
$$

MSE is not arbitrary — under Gaussian noise it *is* the negative log-likelihood, tying regression straight to [[probability]].

## The Normal Equation

For linear regression the optimum has a closed form:

$$
w^\star = (X^\top X)^{-1} X^\top y
$$

```python
import numpy as np

def ols(X, y):
    X = np.column_stack([np.ones(len(X)), X])   # add bias column
    return np.linalg.solve(X.T @ X, X.T @ y)
```

> [!note] When the inverse breaks
> If $X^\top X$ is singular (collinear features, more features than rows) the normal equation fails — gradient methods and regularization take over.

## Assumptions Worth Remembering

| Assumption | Violation symptom |
| --- | --- |
| Linearity in parameters | curved residuals |
| Homoscedastic noise | fanning residuals |
| Independent samples | autocorrelated errors |

## From Here

- Predict *classes* instead of numbers → [[classification]].
- Iterative solution instead of closed form → [[gradient-descent]].
- Replace the linear map with learned features → [[neural-networks]].
