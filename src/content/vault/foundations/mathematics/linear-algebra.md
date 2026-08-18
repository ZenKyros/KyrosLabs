---
title: Linear Algebra
description: "Vectors, matrices and transformations — the coordinate system of machine learning."
type: concept
level: foundations
status: mastered
tags:
  - math
  - linear-algebra
related:
  - calculus
  - optimization
updated: 2025-11-02
---

# Linear Algebra

Almost every object in machine learning — a data point, a weight matrix, an [[embeddings|embedding]] — is a vector or a matrix. Linear algebra is the language that lets models *compute with meaning*.

## Vectors and Vector Spaces

A vector $v \in \mathbb{R}^n$ is an ordered list of $n$ real numbers. What matters is not the list itself but the **space** it lives in and the operations that space allows:

$$
\alpha u + \beta v \in V \quad \forall\, u, v \in V,\; \alpha, \beta \in \mathbb{R}
$$

- **Inner product** $\langle u, v \rangle = \sum_i u_i v_i$ measures alignment — the seed of every similarity score in ML.
- **Norm** $\|v\|_2 = \sqrt{\langle v, v \rangle}$ measures magnitude — used for regularization.
- **Orthogonality** $\langle u, v \rangle = 0$ — the idea behind decorrelated features.

## Matrices as Transformations

A matrix $A \in \mathbb{R}^{m \times n}$ is a *function*: it maps $\mathbb{R}^n \to \mathbb{R}^m$. A fully connected layer is literally this map plus a bias:

$$
y = Wx + b
$$

```python
import numpy as np

W = np.random.randn(128, 784) * 0.01   # linear map R^784 -> R^128
x = np.random.randn(784)
y = W @ x                               # one forward pass
```

## Eigenvectors and Eigenvalues

Directions that a transformation merely *stretches*:

$$
Av = \lambda v
$$

Eigendecomposition powers PCA, spectral clustering and the stability analysis of deep networks. Singular Value Decomposition $A = U\Sigma V^\top$ is its more general cousin.

| Decomposition | Form | ML use |
| --- | --- | --- |
| Eigendecomposition | $A = Q\Lambda Q^{-1}$ | PCA, dynamics |
| SVD | $A = U\Sigma V^\top$ | low-rank approximation, LoRA |
| Cholesky | $A = LL^\top$ | fast sampling from Gaussians |

## Why Machine Learning Needs It

> [!tip] Intuition
> Training a network is walking over a loss *surface*; linear algebra describes the local geometry of that surface — the Jacobian tells you how every output wiggles when every input wiggles.

<details>
<summary>Rank, intuitively</summary>

The rank of a matrix is the dimension of its output space — how many *independent* directions it can reach. Low-rank structure is why compression tricks like LoRA work at all.

</details>

## Connections

- Gradients are vectors; the chain rule needs the **Jacobian**, see [[calculus]].
- Most training is an [[optimization]] problem written in matrix form.
- In deep learning, weight matrices become the learned objects: [[neural-networks]].
