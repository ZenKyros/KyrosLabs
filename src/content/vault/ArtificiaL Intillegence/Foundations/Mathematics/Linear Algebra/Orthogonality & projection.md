---
title: Orthogonality & Projections   
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear-algebra
  - Vector 
---


# Orthogonality & Projections

## Orthogonality

Two vectors are **orthogonal** if they are perpendicular to each other.

For vectors $\mathbf{x}$ and $\mathbf{y}$:

$$\boxed{\mathbf{x}^T\mathbf{y}=0}$$

This is the main test for orthogonality.


### Example

$$\mathbf{x} = \begin{bmatrix} 1 \\ 2 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 2 \\ -1 \end{bmatrix}$$

Calculate the dot product:

$$\mathbf{x}^T\mathbf{y} = 1(2) + 2(-1) = 2 - 2 = 0$$

Therefore:

$$\boxed{\mathbf{x} \perp \mathbf{y}}$$

The symbol $\perp$ means **orthogonal**.


## Connection Between Dot Product and Angle

Recall:

$$\mathbf{x}^T\mathbf{y} = \|\mathbf{x}\|_2\|\mathbf{y}\|_2\cos\theta$$

If vectors are orthogonal:

$$\mathbf{x}^T\mathbf{y}=0$$

then:

$$\cos\theta=0$$

so:

$$\boxed{\theta=90^\circ}$$

Therefore:

$$\boxed{ \text{Orthogonal} \iff \text{dot product}=0 }$$


## Orthogonal Vectors vs Orthogonal Set

A set of vectors is **orthogonal** if every pair of distinct vectors is orthogonal.

For example:

$$\mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \qquad \mathbf{v}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \qquad \mathbf{v}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$

We have:

$$\mathbf{v}_1^T\mathbf{v}_2 = 0, \qquad \mathbf{v}_1^T\mathbf{v}_3 = 0, \qquad \mathbf{v}_2^T\mathbf{v}_3 = 0$$

Therefore, the set is orthogonal.


## Orthogonal and Orthonormal

These are different.

### Orthogonal

Vectors are perpendicular:

$$\mathbf{v}_i^T\mathbf{v}_j = 0 \quad (i \neq j)$$

### Orthonormal

Vectors are:

1. Orthogonal to each other
2. Each has length $1$

So:

$$\boxed{ \text{Orthonormal} = \text{Orthogonal} + \text{Unit length} }$$

Example:

$$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \qquad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

They are orthonormal because:

$$\mathbf{e}_1^T\mathbf{e}_2 = 0$$

and:

$$\|\mathbf{e}_1\|_2 = \|\mathbf{e}_2\|_2 = 1$$



## Projection

A **projection** tells us how much of one vector lies in the direction of another vector.

Suppose we have $\mathbf{x}$ and want to project it onto $\mathbf{u}$.

The projection of $\mathbf{x}$ onto $\mathbf{u}$ is:

$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = \frac{\mathbf{x}^T\mathbf{u}}{\mathbf{u}^T\mathbf{u}} \mathbf{u} }$$

Since:

$$\mathbf{u}^T\mathbf{u} = \|\mathbf{u}\|_2^2$$

we can also write:

$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = \frac{\mathbf{x}^T\mathbf{u}}{\|\mathbf{u}\|_2^2} \mathbf{u} }$$


## Projection Example

Let:

$$\mathbf{x} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}, \qquad \mathbf{u} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

We want to find:

$$\operatorname{proj}_{\mathbf{u}}(\mathbf{x})$$

### Step 1: Dot product

$$\mathbf{x}^T\mathbf{u} = 3(1) + 4(0) = 3$$

### Step 2: Calculate $\mathbf{u}^T\mathbf{u}$

$$\mathbf{u}^T\mathbf{u} = 1^2 + 0^2 = 1$$

### Step 3: Projection Calculation

$$\operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = \frac{3}{1} \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

Therefore:

$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = \begin{bmatrix} 3 \\ 0 \end{bmatrix} }$$

Geometrically, we are dropping a perpendicular line from the tip of vector $\mathbf{x}$ down onto the line spanned by vector $\mathbf{u}$.


![](https://images.openai.com/static-rsc-4/_zl5aBG1EQzEk3vwKqszseEbB8b2gAU34tyP86gd8GLhFHjxhe_IFUtN3zhHInsVRrc1NTjxUIFiFGAgPdjMeuKt1XnmwCO7DXovYfaN5Mai3BS8h8AR6IMLyssy33xq8wG1hd0z6WHGHLlju2_LG5PdAoqZobac-EfLDYwkah4?purpose=inline)

## 7. Projection Onto a Unit Vector

If $\mathbf{u}$ is a **unit vector**, then:

$$\|\mathbf{u}\|_2 = 1$$

Therefore:

$$\mathbf{u}^T\mathbf{u} = 1$$

and the projection formula becomes much simpler:

$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = (\mathbf{x}^T\mathbf{u})\mathbf{u} }$$

This formula is worth remembering.


## Scalar Projection

Sometimes we only want to know **how much of $\mathbf{x}$ points in the direction of $\mathbf{u}$**.

The scalar projection is:

$$\boxed{ \operatorname{comp}_{\mathbf{u}}(\mathbf{x}) = \frac{\mathbf{x}^T\mathbf{u}}{\|\mathbf{u}\|_2} }$$

If $\mathbf{u}$ is a unit vector:

$$\boxed{ \operatorname{comp}_{\mathbf{u}}(\mathbf{x}) = \mathbf{x}^T\mathbf{u} }$$

### Difference

**Scalar projection:** $$\text{a number}$$

**Vector projection:** $$\text{a vector}$$
 
## Projection Decomposition

A vector can be decomposed into two parts:

$$\boxed{ \mathbf{x} = \mathbf{x}_{\parallel} + \mathbf{x}_{\perp} }$$

where:
* $\mathbf{x}_{\parallel}$ is the component parallel to $\mathbf{u}$.
* $\mathbf{x}_{\perp}$ is the component perpendicular to $\mathbf{u}$.

The parallel component is the vector projection:

$$\mathbf{x}_{\parallel} = \operatorname{proj}_{\mathbf{u}}(\mathbf{x})$$

Therefore, the perpendicular component (orthogonal complement) is:

$$\boxed{ \mathbf{x}_{\perp} = \mathbf{x} - \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) }$$

---

# 10. Example of Decomposition

Let:

$$\mathbf{x} = \begin{bmatrix} 3 \\ 4 \end{bmatrix}, \qquad \mathbf{u} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

We already found the parallel component:

$$\mathbf{x}_{\parallel} = \begin{bmatrix} 3 \\ 0 \end{bmatrix}$$

Therefore, we calculate the perpendicular component:

$$\mathbf{x}_{\perp} = \begin{bmatrix} 3 \\ 4 \end{bmatrix} - \begin{bmatrix} 3 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 4 \end{bmatrix}$$

$$\boxed{ \mathbf{x}_{\perp} = \begin{bmatrix} 0 \\ 4 \end{bmatrix} }$$

So the complete orthogonal decomposition is:

$$\boxed{ \begin{bmatrix} 3 \\ 4 \end{bmatrix} = \begin{bmatrix} 3 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ 4 \end{bmatrix} }$$

---


## Projection Onto a Subspace

Projection isn't limited to a single vector.

Suppose $W$ is a subspace.

We can project $\mathbf{x}$ onto $W$.

The result is the vector in $W$ that is **closest to $\mathbf{x}$**.

Conceptually:

$$\boxed{ \mathbf{x} = \mathbf{x}_W + \mathbf{x}_{W^\perp} }$$

where:
* $\mathbf{x}_W \in W$
* $\mathbf{x}_{W^\perp} \in W^\perp$ (meaning $\mathbf{x}_{W^\perp} \perp W$)

---

##  Projection Matrix

Projection can also be represented using a matrix.

If $A$ contains the basis vectors of a subspace, then the projection matrix is:

$$\boxed{ P = A(A^TA)^{-1}A^T }$$

Then:

$$\boxed{ \operatorname{proj}_W(\mathbf{x}) = P\mathbf{x} }$$

This is important when projection is performed repeatedly or on large sets of vectors.




## Projection Matrix for an Orthonormal Basis

If the columns of $Q$ are **orthonormal**, then:

$$Q^TQ = I$$

Therefore, the projection matrix simplifies to:

$$\boxed{ P = QQ^T }$$

and:

$$\boxed{ \operatorname{proj}_W(\mathbf{x}) = QQ^T\mathbf{x} }$$

This is a very useful special case.

---

# 14. Properties of a Projection Matrix

For an orthogonal projection matrix $P$:

### Property 1 — Projecting twice changes nothing

$$\boxed{P^2 = P}$$

This is called **idempotence**.

Once a vector is already projected onto the subspace, projecting it again gives the same result.

### Property 2 — Symmetric

$$\boxed{P^T = P}$$

for an orthogonal projection matrix.


## Distance to a Subspace

Projection also gives us the shortest distance from a vector to a subspace.

If:

$$\mathbf{x}_{\text{proj}} = \operatorname{proj}_W(\mathbf{x})$$

then:

$$\boxed{ d(\mathbf{x}, W) = \|\mathbf{x} - \mathbf{x}_{\text{proj}}\|_2 }$$

The error vector:

$$\mathbf{x} - \mathbf{x}_{\text{proj}}$$

is perpendicular to the subspace.


## Key Geometric Idea

Projection answers:

> **"What part of this vector lies inside this direction or subspace?"**

The decomposition is:

$$\boxed{ \mathbf{x} = \underbrace{\mathbf{x}_{\parallel}}_{\text{projection}} + \underbrace{\mathbf{x}_{\perp}}_{\text{error}} }$$

with:

$$\mathbf{x}_{\parallel} \in W$$

and:

$$\mathbf{x}_{\perp} \perp W$$

## Important Formulas

### 1. Orthogonality
$$\boxed{ \mathbf{x}^T\mathbf{y} = 0 }$$
* **Context:** The fundamental algebraic test to prove that two vectors are completely perpendicular.

### 2. Angle Between Vectors
$$\boxed{ \mathbf{x}^T\mathbf{y} = \|\mathbf{x}\|_2\|\mathbf{y}\|_2\cos\theta }$$
* **Context:** Connects the lengths of vectors $\mathbf{x}$ and $\mathbf{y}$ directly to the angle $\theta$ between them.

### 3. Projection Onto a Vector
$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = \frac{\mathbf{x}^T\mathbf{u}}{\mathbf{u}^T\mathbf{u}}\mathbf{u} }$$
* **Context:** Finds the portion of vector $\mathbf{x}$ that lies along the direction of vector $\mathbf{u}$.

### 4. Projection Onto a Unit Vector
$$\boxed{ \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) = (\mathbf{x}^T\mathbf{u})\mathbf{u} }$$
* **Context:** A streamlined case that applies exclusively when the target vector $\mathbf{u}$ has a unit length of $1$.

### 5. Perpendicular Component
$$\boxed{ \mathbf{x}_{\perp} = \mathbf{x} - \operatorname{proj}_{\mathbf{u}}(\mathbf{x}) }$$
* **Context:** Extracts the component of vector $\mathbf{x}$ that is orthogonal to vector $\mathbf{u}$ (the error vector).

### 6. General Projection Matrix
$$\boxed{ P = A(A^TA)^{-1}A^T }$$
* **Context:** Creates a transformation matrix $P$ when the columns of matrix $A$ contain any arbitrary basis vectors.

### 7. Orthonormal-Basis Projection Matrix
$$\boxed{ P = QQ^T }$$
* **Context:** A beautiful simplification that occurs only when the columns of matrix $Q$ form a perfectly orthonormal basis.

### 8. Projection Onto a Subspace
$$\boxed{ \operatorname{proj}_W(\mathbf{x}) = P\mathbf{x} }$$
* **Context:** Maps any vector $\mathbf{x}$ to its closest possible geometric neighbor located within the vector subspace $W$.

### 9. Distance to a Subspace
$$\boxed{ d(\mathbf{x}, W) = \|\mathbf{x} - P\mathbf{x}\|_2 }$$
* **Context:** Computes the absolute shortest geometric distance from a vector $\mathbf{x}$ to a subspace $W$.
