---
title: Linear Systems & Linear Transformations  
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear-algebra
  - PCA 
  - SVD
---

# Linear Systems & Linear Transformations

## What is a Linear System?

A **linear system** is a collection of one or more linear equations involving the same set of variables.

### *Algebraic Form*

i) 2x+3y=8 <br>
ii) x−y=2​

This system has 2 equations and 2 unknowns (x and y).

### *Matrix Form*

Any linear system can be expressed compactly in matrix notation:

Ax=b

Where:

- $A \in \mathbb{R}^{m \times n}$ is the coefficient matrix.
    
- $x∈R^n$ is the unknown vector.
    
- $b∈R^m$ is the constants vector.
    

For the system above:

$$
\begin{bmatrix} 
2 & 3 \\ 
1 & -1 
\end{bmatrix}
\begin{bmatrix} 
x \\ 
y 
\end{bmatrix}
=
\begin{bmatrix} 
8 \\ 
2 
\end{bmatrix}
$$


## Why Linear Systems Matter in AI

Linear systems form the foundational engine for parameter estimation, forward computation, dimensionality reduction, and optimization across artificial intelligence algorithms.


| ML / AI Area | Linear System Form | Purpose |
| :--- | :--- | :--- |
| **Linear Regression** | $(X^T X)w = X^T y$ | Find optimal weight parameters via Normal Equations |
| **Neural Networks** | $z = Wx + b$ | Forward pass layer transformation |
| **PCA** | $Av = \lambda v$ | Solve eigenvalue problem for feature variance maximization |
| **Support Vector Machines** | Dual QP Form | Solve quadratic optimization under linear constraints |
| **Gaussian Processes** | $(K + \sigma^2 I)\alpha = y$ | Kernel-based Bayesian inference and regression |
| **GANs** | $z = z_1 + t(z_2 - z_1)$ | Latent space linear interpolation |
| **Attention Mechanisms** | $\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$ | Compute weighted feature representation based on similarity |
| **Convolutional Networks** | $Y = W * X$ (or $Y = X_{\text{im2col}} W^T$) | Linear transformation via structured kernel matrices |

## Solving Linear Systems

### Methods Overview

|Method|Best For|Time Complexity|Pros|Cons|
|---|---|---|---|---|
|**Gaussian Elimination**|Small to medium exact solves|O(n3)|Direct, straightforward solution|Slow for large n, vulnerable to drift|
|**LU Decomposition**|Repeated solves with constant A|O(n3)|Efficient factorization for multiple b|High memory consumption|
|**Cholesky Decomposition**|Symmetric Positive Definite (SPD) A|O(n3)|2× faster than LU for SPD matrices|Strictly limited to SPD matrices|
|**QR Decomposition**|Overdetermined least squares|O(n3)|Superior numerical stability for ill-conditioned A|Slower than LU decomposition|
|**Singular Value Decomposition (SVD)**|Ill-conditioned or rank-deficient systems|O(n3)|Solves any linear system (pseudoinverse)|Computationally expensive|
|**Conjugate Gradient**|Large, sparse SPD systems|O(n⋅iters)|Extremely memory efficient|Requires SPD matrix structure|
|**Gradient Descent**|Massive systems, approximate solves|O(n⋅iters)|Highly scalable, parallelizable|Yields approximate solutions|
|**Adam / Optimizers**|High-dimensional neural network weights|O(n⋅iters)|Adaptive learning rates, non-convex scaling|Approximate solution only|

### Working  Example: Gaussian Elimination
> Use the [Gaussian Elimination Calculator](https://onlinemschool.com/math/assistance/equation/gaus/) to solve the system of linear equations step-by-step.


## Systems Classification

### Existence and Uniqueness of Solutions

- **Consistent System:** Has at least one solution (either unique or infinitely many).
    
- **Inconsistent System:** Has zero solutions.
    


| Type | Number of Solutions | Matrix Shape | Mathematical Condition |
| :--- | :--- | :--- | :--- |
| **Unique Solution** | Exactly 1 | Any shape ($m \ge n$) | $\text{rank}(A) = \text{rank}([A \mid b]) = n$ |
| **Infinitely Many** | Infinite | Any shape (often $m < n$) | $\text{rank}(A) = \text{rank}([A \mid b]) < n$ |
| **No Solution** | 0 | Any shape | $\text{rank}(A) < \text{rank}([A \mid b])$ |


### Example Scenarios

### i. *Unique Solution* 
($\text{rank}(A) = n$)

$$\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 5 \\ 11 \end{bmatrix} \implies \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}$$

### ii. *Infinite Solutions* 
($\text{rank}(A) < n$)

$$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 3 \\ 6 \end{bmatrix} \implies x + 2y = 3$$

### iii. *No Solution*
($\text{rank}(A) < \text{rank}([A \mid b])$)

$$\begin{bmatrix} 1 & 2 \\ 2 & 4 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 3 \\ 7 \end{bmatrix} \implies 0 = 1 \quad \text{(Contradiction)}$$


## Linear Transformations

### Definition

A function $T: \mathbb{R}^n \to \mathbb{R}^m$ is a **linear transformation** if and only if it preserves vector addition and scalar multiplication:

1. **Additivity:** $T(u + v) = T(u) + T(v)$
2. **Homogeneity:** $T(cv) = cT(v)$ for any scalar $c$

### Matrix Representation

Every linear transformation between finite-dimensional vector spaces can be represented uniquely as a matrix multiplication:

$$T(x) = Ax \quad \text{where} \quad A \in \mathbb{R}^{m \times n}$$

## Important Linear Transformations in AI

### Transformation Matrix Reference

| Transformation | Matrix Representation | Role in AI & ML |
| :--- | :--- | :--- |
| **Identity** | $I_n$ | Residual connections (ResNets: $x + F(x)$) |
| **Scaling** | $cI_n$ or $\text{diag}(s_1, \dots, s_n)$ | Feature scaling, weight decay regularization |
| **Rotation (2D)** | $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$ | Data augmentation, coordinate frames |
| **Shear** | $\begin{bmatrix} 1 & k \\ 0 & 1 \end{bmatrix}$ | Spatial data augmentation |
| **Orthogonal Projection** | $P = A(A^T A)^{-1} A^T$ | Principal Component Analysis (PCA), subspace projection |
| **Reflection** | $R = I - 2uu^T$ | Householder reflections, QR decomposition |
| **Permutation** | Binary matrix with single 1 per row/column | Feature reordering, multi-head attention sorting |
| **Convolution** | Block Toeplitz / Circulant Matrix | Spatial feature extraction in CNNs |
| **Dropout** | Diagonal matrix $D_{ii} \in \left\{0, \frac{1}{1-p}\right\}$ | Stochastic regularization |
| **Batch Normalization** | $x \mapsto \gamma \hat{x} + \beta$ | Affine rescaling of intermediate layer activations |



##  Visualizing Transformations

### Scaling Transformation

$$A = \begin{bmatrix} 2 & 0 \\ 0 & 0.5 \end{bmatrix}$$

- **Input:** $x = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \implies Ax = \begin{bmatrix} 2 \\ 0.5 \end{bmatrix}$
- **Effect:** Doubles dimension along the x-axis, halves dimension along the y-axis.

### Shear Transformation

$$A = \begin{bmatrix} 1 & 0.5 \\ 0 & 1 \end{bmatrix}$$

- **Input:** $x_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \implies Ax_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ (no change)
- **Input:** $x_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix} \implies Ax_2 = \begin{bmatrix} 0.5 \\ 1 \end{bmatrix}$ (slanted right)
2​=[01​]⟹Ax2​=[0.51​] (slanted right)
    

## Properties of Linear Transformations

### Invertibility

A linear transformation $T(x) = Ax$ is **invertible** if there exists a unique transformation $T^{-1}$ such that:

$$T^{-1}(T(x)) = x \implies A^{-1}A = I$$

- **Condition:** $\det(A) \neq 0$ (Matrix must be square and full rank).
- **Applications in AI:** Invertible Neural Networks (INNs), Normalizing Flows (e.g., RealNVP, Glow), and exact density calculation in generative modeling.

### Kernel (Null Space)

The **kernel** of $T$ is the set of vectors mapped to the zero vector:

$$\ker(T) = \text{Null}(A) = \{x \in \mathbb{R}^n : Ax = 0\}$$

- **AI Relevance:** Quantifies information loss in feedforward networks; feature dimensions/directions with zero variance in PCA belong to the kernel of the empirical covariance matrix.

### Image (Column Space)

The **image** (or range) of $T$ is the set of all achievable output vectors:

$$\text{im}(T) = \text{Col}(A) = \{Ax : x \in \mathbb{R}^n\}$$

- **AI Relevance:** Defines the expressive capacity (range) of generative models and representation limits of projection layers.


## Rank and Its Importance

### Definition & Properties

The **rank** of a matrix $A$ is the dimension of its column space, representing the maximum number of linearly independent column vectors.

- $\text{rank}(A) \le \min(m, n)$
- $\text{rank}(AB) \le \min(\text{rank}(A), \text{rank}(B))$
- $\text{rank}(A) = \text{rank}(A^T)$
- **Rank-Nullity Theorem:**

$$\text{rank}(A) + \text{nullity}(A) = n$$

### Low-Rank Approximation

A high-dimensional matrix $A \in \mathbb{R}^{m \times n}$ can be approximated by lower-dimensional factors of rank $r \ll \min(m, n)$:

$$A \approx U V^T \quad \text{where} \quad U \in \mathbb{R}^{m \times r}, \quad V \in \mathbb{R}^{n \times r}$$

### Applications in AI

- **Model Compression:** Reducing weight parameter counts in large linear layers to shrink the memory footprint.
- **Recommender Systems:** Matrix factorization via truncated SVD to discover latent user-item features.
- **Fine-Tuning:** Low-Rank Adaptation (LoRA) for adapting Large Language Models efficiently.

### LoRA in Transformer Models

Instead of updating a large weight matrix $W_0 \in \mathbb{R}^{d \times k}$ directly during fine-tuning, LoRA parameterizes the weight update $\Delta W$ as a low-rank decomposition:

$$W = W_0 + \Delta W = W_0 + BA$$

Where $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$ with intrinsic rank $r \ll \min(d, k)$.


## Eigenvalues and Eigenvectors

### Definition

For a square matrix $A \in \mathbb{R}^{n \times n}$, a non-zero vector $v$ is an **eigenvector** with a corresponding scalar **eigenvalue** $\lambda$ if:

$$Av = \lambda v$$

### Characteristic Equation

To find the eigenvalues, solve the roots of the characteristic polynomial:

$$\det(A - \lambda I) = 0$$

### Worked Example

Find the eigenvalues and eigenvectors for $A = \begin{bmatrix} 3 & 1 \\ 1 & 3 \end{bmatrix}$:

1. **Solve $\det(A - \lambda I) = 0$:**
   
   $$\det\begin{bmatrix} 3-\lambda & 1 \\ 1 & 3-\lambda \end{bmatrix} = (3-\lambda)^2 - 1 = 0$$
   $$\lambda^2 - 6\lambda + 8 = 0 \implies \lambda_1 = 4, \quad \lambda_2 = 2$$

2. **Find the eigenvector for $\lambda_1 = 4$:**
   Substitute $\lambda = 4$ into $(A - \lambda I)v = 0$:
   
   $$\begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies -v_1 + v_2 = 0 \implies v_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$

3. **Find the eigenvector for $\lambda_2 = 2$:**
   Substitute $\lambda = 2$ into $(A - \lambda I)v = 0$:
   
   $$\begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies v_1 + v_2 = 0 \implies v_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$$

### Applications in AI

- **PCA:** Principal axes match the eigenvectors of the data covariance matrix $\Sigma$, while the eigenvalues reflect the variance captured along those axes.
- **Spectral Clustering:** Identifies clusters in non-linear spaces using the eigenvectors of the normalized Graph Laplacian matrix.
- **ResNet & Recurrent Stability:** The spectral radius (maximum eigenvalue magnitude) of weight matrices dictates stability against vanishing or exploding gradients.
- **Hessian Analysis:** Eigenvalues of the Loss Hessian matrix dictate the local curvature of the loss landscape, controlling optimal learning rates and training stability.


## 10. Matrix Decompositions

### Singular Value Decomposition (SVD)

Every real matrix $(A \in \mathbb{R}^{m \times n})$ can be factorized into three matrices:

$[A = U \Sigma V^T]$

Where:
- $(U \in \mathbb{R}^{m \times m})$: Left singular vectors (orthonormal columns).
- $(\Sigma \in \mathbb{R}^{m \times n})$: Rectangular diagonal matrix containing sorted, non-negative singular values $(\sigma_i \ge 0)$.
- $(V \in \mathbb{R}^{n \times n}$): Right singular vectors (orthonormal columns).

```python
import numpy as np

# Python SVD Implementation
A = np.array([[1, 2], [3, 4], [5, 6]])
U, S, Vt = np.linalg.svd(A)

print("U shape:", U.shape)    # (3, 3)
print("S shape:", S.shape)    # (2,)
print("Vt shape:", Vt.shape)  # (2, 2)
```

### QR Decomposition

Factorizes a matrix into an orthogonal matrix $(Q)$ and an upper triangular matrix $(R)$:

$[A = QR]$

Where:
- $(Q^T Q = I)$ (The columns of $(Q)$ form an orthonormal basis).
- **AI Use Case:** Provides a numerically stable least-squares solver by avoiding the direct calculation and potential ill-conditioning of the normal equations matrix $(X^T X)$.

```python
import numpy as np

# Python QR Implementation
A = np.array([[1, 2], [3, 4], [5, 6]])
Q, R = np.linalg.qr(A)

print("Q shape:", Q.shape)    # (3, 2)
print("R shape:", R.shape)    # (2, 2)
```

### LU Decomposition

Factorizes a square matrix $(A)$ into a lower triangular matrix $(L)$ and an upper triangular matrix $(U)$:

$[PA = LU]$

Where:
- $(P)$ is a permutation matrix representing row swaps.
- **AI Use Case:** Accelerates system solving through efficient forward-backward substitution for processing structural linear equation batches and stable determinant computations.

```python
import numpy as np
import scipy.linalg as la

# Python LU Implementation (requires a square matrix)
A_square = np.array([[1, 2], [3, 4]])
P, L, U = la.lu(A_square)

print("P shape:", P.shape)    # (2, 2) - Permutation matrix
print("L shape:", L.shape)    # (2, 2) - Lower triangular matrix
print("U shape:", U.shape)    # (2, 2) - Upper triangular matrix
```



## Linear Systems in Neural Networks

### Forward Pass as Affine Transformation

A feedforward neural network layer performs an affine transformation followed by an element-wise non-linear activation function:

$$z^{(l)} = W^{(l)}a^{(l-1)} + b^{(l)}$$

$$a^{(l)} = f(z^{(l)})$$

Where:
* **$z^{(l)}$**: Pre-activation values (net Input) .
* **$W^{(l)}$**: Layer weights.
* **$a^{(l-1)}$**: Previous layer outputs.
* **$b^{(l)}$**: Layer biases.
* **$f$**: Activation function.
* **$a^{(l)}$**: Final layer outputs.


### Layer Operations Mapping

| Layer Type | Transformation Equation | Parameter Shapes |
| :--- | :--- | :--- |
| **Fully Connected (Dense)** | $z = Wx + b$ | $W \in \mathbb{R}^{m \times n}, b \in \mathbb{R}^m$ |
| **Convolutional Layer** | $z = W * x + b$ | Doubly block circulant matrix $W$ |
| **Self-Attention** | $Q = XW_Q, K = XW_K, V = XW_V$ | $W_Q, W_K, W_V \in \mathbb{R}^{d_{\text{model}} \times d_k}$ |
| **Recurrent Layer (RNN)** | $h_t = \tanh(W_{hh}h_{t-1} + W_{xh}x_t + b)$ | $W_{hh} \in \mathbb{R}^{h \times h}, W_{xh} \in \mathbb{R}^{h \times d}$ |
| **Batch Normalization** | $y = \gamma \odot \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} + \beta$ | Diagonal scaling matrix $\Gamma$ and translation vector $\beta$ |


## Practical Numerics & Stability

### Condition Number and Regularization

The stability of solving $Ax = b$ depends on the **condition number** $\kappa(A)$:

$$\kappa(A) = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}$$

If $\kappa(A)$ is large, the matrix is **ill-conditioned** (small perturbations in inputs lead to massive errors in outputs).

Where:
* **$\kappa(A)$**: Condition number.
* **$\sigma_{\max}(A)$**: Largest singular value of $A$.
* **$\sigma_{\min}(A)$**: Smallest singular value of $A$.

### Solutions for Ill-Conditioned Systems

1. **Ridge Regularization (Tikhonov Regularization):** Adds a small diagonal bump to ensure invertibility:

$$(X^T X + \lambda I)w = X^T y$$

Where:
* **$X$**: Design feature matrix.
* **$\lambda$**: Regularization strength penalty.
* **$I$**: Identity matrix.
* **$w$**: Optimized weights vector.
* **$y$**: Ground-truth target labels.

2. **Moore-Penrose Pseudoinverse via SVD:**

$$x = A^{+}b = V \Sigma^{+} U^T b$$

Where:
* **$A^{+}$**: Pseudoinverse matrix.
* **$V$**: Right singular vectors.
* **$\Sigma^{+}$**: Reciprocal non-zero singular values.
* **$U^T$**: Transposed left singular vectors.
* **$b$**: Constant target vector.

3. **Feature Scaling / Normalization:** Centers features to keep $\kappa(A)$ close to 1.


## Linear Systems Across AI Paradigms

### Supervised Learning

Linear Regression parameter estimation (Normal Equation):

$$w^* = (X^T X)^{-1} X^T y$$

Ridge Regression closed form:

$$w^* = (X^T X + \lambda I)^{-1} X^T y$$

Where:
* **$w^*$**: Optimal weight vector.
* **$X$**: Design matrix of input data features.
* **$y$**: Vector of observed target values.
* **$\lambda$**: Regularization strength penalty hyperparameter.
* **$I$**: Identity matrix.

### Unsupervised Learning

PCA computation over zero-mean data matrix $X \in \mathbb{R}^{N \times d}$:

$$\Sigma = \frac{1}{N} X^T X$$

Eigenvalue decomposition:

$$\Sigma v_i = \lambda_i v_i$$

Where:
* **$\Sigma$**: Empirical covariance matrix.
* **$N$**: Total number of data samples.
* **$v_i$**: The $i$-th eigenvector (principal component axis).
* **$\lambda_i$**: The $i$-th eigenvalue (variance along that axis).

### Deep Learning Gradient Flow (Backpropagation)

Given loss scalar $L$ and linear layer step $z = Wx + b$:

- **Weight Gradient:**

$$\frac{\partial L}{\partial W} = \left(\frac{\partial L}{\partial z}\right) x^T$$

- **Input Gradient (Vector-Jacobian Product):**

$$\frac{\partial L}{\partial x} = W^T \left(\frac{\partial L}{\partial z}\right)$$

Where:
* **$L$**: Loss function scalar value.
* **$z$**: Linear layer pre-activation output vector.
* **$W$**: Layer weight parameter matrix.
* **$x$**: Input layer feature vector.
* **$\frac{\partial L}{\partial z}$**: Incoming gradient of the loss with respect to $z$.
