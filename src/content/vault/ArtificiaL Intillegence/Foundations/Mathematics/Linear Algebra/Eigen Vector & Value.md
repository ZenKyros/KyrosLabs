---
title: Eigenvalues and Eigenvectors   
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear-algebra
  - Vector 
---

## Why Eigenvalues and Eigenvectors?

For a square matrix $A$, most vectors change both **direction and magnitude** when multiplied by $A$.

But some special non-zero vectors keep their direction. They only get scaled.

These special vectors are **eigenvectors**.

The amount by which they are scaled is the **eigenvalue**.

The fundamental equation is:

$$\boxed{A\mathbf{v} = \lambda\mathbf{v}}$$

where:
* $A$ is the square matrix.
* $\mathbf{v}$ is the eigenvector ($\mathbf{v} \neq \mathbf{0}$).
* $\lambda$ is the eigenvalue.


## Eigenvector

A non-zero vector $\mathbf{v}$ is an eigenvector of $A$ if the transformation only changes its **magnitude**, but not its direction.

### Example

$$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}, \qquad \mathbf{v} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

Then:

$$A\mathbf{v} = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix}$$

Therefore:

$$A\mathbf{v} = 2 \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

So the scaling factor and vector are:

$$\boxed{\lambda = 2} \qquad \boxed{ \mathbf{v} = \begin{bmatrix} 1 \\ 0 \end{bmatrix} }$$



## Eigenvalue Interpretation

The eigenvalue $\lambda$ tells us exactly **how the eigenvector is scaled**:

* **$\lambda > 1$:** The vector is stretched in the same direction.
* **$0 < \lambda < 1$:** The vector is compressed in the same direction.
* **$\lambda = 1$:** The vector remains completely unchanged.
* **$\lambda = 0$:** The vector is collapsed down into the zero vector.
* **$\lambda < 0$:** The vector's direction is perfectly reversed and scaled.




### How to Find Eigenvalues

Start with the fundamental equation:

$$A\mathbf{v} = \lambda\mathbf{v}$$

Move everything to one side:

$$A\mathbf{v} - \lambda\mathbf{v} = \mathbf{0}$$

Factor out the vector $\mathbf{v}$ by introducing the identity matrix $I$:

$$(A - \lambda I)\mathbf{v} = \mathbf{0}$$

For a non-zero (trivial) eigenvector to exist, the matrix $(A - \lambda I)$ must be singular (non-invertible). Therefore, its determinant must be zero:

$$\boxed{ \det(A - \lambda I) = 0 }$$

This is called the **characteristic equation**.

### Example: Finding Eigenvalues

Consider the matrix:

$$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$$

First, set up the characteristic matrix $A - \lambda I$:

$$A - \lambda I = \begin{bmatrix} 2-\lambda & 0 \\ 0 & 3-\lambda \end{bmatrix}$$

Calculate the determinant of this diagonal matrix:

$$\det(A - \lambda I) = (2 - \lambda)(3 - \lambda)$$

Set the resulting polynomial equal to zero:

$$(2 - \lambda)(3 - \lambda) = 0$$

Solving for $\lambda$ yields:

$$\boxed{\lambda_1 = 2, \qquad \lambda_2 = 3}$$

These are the calculated eigenvalues.




## How to Find Eigenvectors

Once an eigenvalue $\lambda$ is known, we substitute it back into the characteristic matrix to find its null space:

$$\boxed{ (A - \lambda I)\mathbf{v} = \mathbf{0} }$$

#### Example: Finding the Eigenvector: for $\lambda_1 = 2$

For the matrix:

$$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$$

we previously found the eigenvalue $\lambda_1 = 2$.

Now, substitute $\lambda = 2$ into the matrix expression:

$$A - 2I = \begin{bmatrix} 2-2 & 0 \\ 0 & 3-2 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}$$

Let our unknown eigenvector be:

$$\mathbf{v} = \begin{bmatrix} x \\ y \end{bmatrix}$$

Set up the homogeneous linear system:

$$\begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

Multiplying out the rows gives the equation:

$$0x + 1y = 0 \implies y = 0$$

Since $x$ does not appear in a pinning constraint, $x$ can be any arbitrary non-zero scalar value. Choosing the simplest basis value $x = 1$, we get our first fundamental eigenvector:

$$\boxed{ \mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix} }$$


#### Finding the Second Eigenvector

For the second eigenvalue:

$$\lambda_2 = 3$$

we set up the characteristic matrix $A - 3I$:

$$A - 3I = \begin{bmatrix} 2-3 & 0 \\ 0 & 3-3 \end{bmatrix} = \begin{bmatrix} -1 & 0 \\ 0 & 0 \end{bmatrix}$$

Setting up the system $(A - 3I)\mathbf{v}_2 = \mathbf{0}$:

$$\begin{bmatrix} -1 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

This multiplication yields the single constraint:

$$-1x + 0y = 0 \implies x = 0$$

Since $y$ is a free variable and can be any arbitrary non-zero scalar value, we choose $y = 1$. This gives our second fundamental eigenvector:

$$\boxed{ \mathbf{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix} }$$

### Complete Summary of Eigenpairs

$$\boxed{ \lambda_1 = 2, \quad \mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix} } \qquad \boxed{ \lambda_2 = 3, \quad \mathbf{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix} }$$


### Important: Eigenvector Is Not Unique

If $\mathbf{v}$ is an eigenvector, then any non-zero scalar multiple of $\mathbf{v}$ is also an eigenvector.

For example, the vectors:

$$\begin{bmatrix} 1 \\ 0 \end{bmatrix} \qquad \text{and} \qquad \begin{bmatrix} 5 \\ 0 \end{bmatrix}$$

represent the exact same eigenvector direction.

Both satisfy the scaling equation:

$$A\mathbf{v} = 2\mathbf{v}$$

Therefore, eigenvectors are fundamentally about **independent directions** rather than one single specific vector.


## Eigenvalue Multiplicity

An eigenvalue can appear more than once in the characteristic polynomial.

For example, the matrix:

$$A = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}$$

has the characteristic polynomial:

$$(2 - \lambda)^2 = 0$$

Therefore, the eigenvalue:

$$\boxed{\lambda = 2}$$

has a multiplicity of $2$.

This is called the **algebraic multiplicity**.

For your current level, just understand that **an eigenvalue can occur multiple times**.

##  Eigenvectors and Matrix Transformation

The key intuition is that a matrix represents a spatial transformation.

Most vectors:

$$\mathbf{x} \rightarrow A\mathbf{x}$$

will change both their direction and magnitude.

However, eigenvectors satisfy:

$$\boxed{ A\mathbf{v} = \lambda\mathbf{v} }$$

meaning their spatial direction is perfectly preserved.

Therefore:
> **Eigenvectors are the special invariant directions of a linear transformation.**

And:
> **Eigenvalues tell us how strongly those special directions are stretched, compressed, or flipped.**



## Eigendecomposition

Now we move from individual eigenvalues/eigenvectors to **Eigendecomposition**.


###  What Is Eigendecomposition?

If a square matrix $A$ has enough linearly independent eigenvectors, we can factorize it as:

$$\boxed{ A = V\Lambda V^{-1} }$$

where $V$ is a matrix containing the eigenvectors as columns:

$$V = \begin{bmatrix} | & | & & | \\ \mathbf{v}_1 & \mathbf{v}_2 & \cdots & \mathbf{v}_n \\ | & | & & | \end{bmatrix}$$

And $\Lambda$ (capital Lambda) is a diagonal matrix containing the eigenvalues along the main diagonal:

$$\Lambda = \begin{bmatrix} \lambda_1 & 0 & \cdots & 0 \\ 0 & \lambda_2 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n \end{bmatrix}$$


### The Three Parts

Remember the fundamental factorization:

$$\boxed{ A = V\Lambda V^{-1} }$$

Matrix $V$
* Contains the **eigenvectors** as its columns.
* It changes the basis to the eigenvector coordinate system.

Matrix $\Lambda$
* A diagonal matrix containing the **eigenvalues** along the main diagonal.
* It applies the pure stretching, compressing, or flipping scaling transformations along those axes.

Matrix :
$V^{-1}$
* The inverse matrix of $V$.
* It transforms the vectors **back** from the eigenvector coordinate system into the original standard basis.


## Example of Eigendecomposition

Consider the matrix:
$$A = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$$

We previously calculated its eigenvectors:
$$\mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \qquad \mathbf{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

Therefore, we assemble the eigenvector matrix $V$:
$$V = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} = I$$

And we assemble the corresponding diagonal eigenvalue matrix $\Lambda$:
$$\Lambda = \begin{bmatrix} 2 & 0 \\ 0 & 3 \end{bmatrix}$$

Since $V = I$, its inverse is simply:
$$V^{-1} = I$$

Substituting these back into the decomposition equation confirms the system:
$$A = V\Lambda V^{-1} = I\Lambda I = \Lambda$$



## Why Eigendecomposition Is Useful

Eigendecomposition decouples a complex matrix operation into simpler, independent parts.

Instead of working with the dense matrix $A$, we analyze its components:
$$V\Lambda V^{-1}$$

The diagonal matrix $\Lambda$ is incredibly powerful because computing matrix powers becomes simple. 

For example, squaring a matrix expands as:
$$A^2 = (V\Lambda V^{-1})(V\Lambda V^{-1})$$

Because the inner inverse and matrix cancel out ($V^{-1}V = I$):
$$\boxed{ A^2 = V\Lambda^2V^{-1} }$$

Extrapolating this to any arbitrary power $k$ yields:
$$\boxed{ A^k = V\Lambda^kV^{-1} }$$

And because $\Lambda$ is a diagonal matrix, finding its power requires only raising the individual diagonal elements to that power:
$$\Lambda^k = \begin{bmatrix} \lambda_1^k & 0 & \cdots & 0 \\ 0 & \lambda_2^k & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & \lambda_n^k \end{bmatrix}$$

### Symmetric Matrices

A particularly important case is a **symmetric matrix**:

$$\boxed{A = A^T}$$

For a real symmetric matrix, three crucial properties always hold:
* All eigenvalues are guaranteed to be real numbers.
* Eigenvectors corresponding to distinct eigenvalues are completely orthogonal.
* Eigenvectors can be normalized to form an orthonormal basis for the space.

Because of these properties, the eigendecomposition simplifies beautifully to:

$$\boxed{ A = Q\Lambda Q^T }$$

This simplification happens because the matrix of eigenvectors $Q$ is orthogonal, meaning its inverse is simply its transpose:

$$Q^{-1} = Q^T$$

This specific factorization is known as **orthogonal eigendecomposition**.


## Important Difference

Remember the clear distinction between factoring general matrices versus symmetric ones:

 General Eigendecomposition
$$\boxed{ A = V\Lambda V^{-1} }$$
* **Context:** Applies to any diagonalizable square matrix. The matrix $V$ contains linearly independent eigenvectors, requiring a standard matrix inverse calculation ($V^{-1}$).

 Symmetric Matrix Decomposition
$$\boxed{ A = Q\Lambda Q^T }$$
* **Core Concept:** A clean simplification for real symmetric matrices where the orthonormal eigenvector matrix $Q$ lets you use a simple transpose instead of an inverse.


## What You Need to Remember

### Eigenvector Equation
$$\boxed{ A\mathbf{v} = \lambda\mathbf{v} }$$
* **Core Concept:** A special non-zero vector whose direction is perfectly preserved during a matrix transformation.

### Eigenvalue
$$\boxed{\lambda}$$
* **Core Concept:** The scalar multiplier that determines how much the corresponding eigenvector stretches, compresses, or flips.

### Characteristic Equation
$$\boxed{ \det(A - \lambda I) = 0 }$$
* **Core Concept:** The foundational polynomial equation used to solve for the unknown eigenvalues of a square matrix.

### Eigenvector System
$$\boxed{ (A - \lambda I)\mathbf{v} = \mathbf{0} }$$
* **Core Concept:** The homogeneous linear system solved using null space methods to find eigenvectors after finding $\lambda$.
