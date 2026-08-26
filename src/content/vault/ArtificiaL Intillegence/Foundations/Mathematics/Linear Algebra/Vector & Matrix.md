---
title: Vector & Matrices  
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear-algebra
---

# Vectors, Matrices & Matrix Multiplication

## Vectors

  

A **vector** is an ordered collection of numbers.

Example:

  

$$\mathbf{x} = \begin{bmatrix} 2\\ 3\\ 5 \end{bmatrix}$$

  

This is a **3-dimensional vector** because it contains 3 numbers.

  

We can also write it horizontally:

  

$$\mathbf{x} = [2,3,5]$$

  

Remember :

  

> A vector is simply a list of numbers representing something.

  

---

  
  

## Vectors in Machine Learning

  

In Machine Learning, vectors are often used to represent **features**.

  

Suppose we want to represent a house using:

  

- Size = 1500 sq ft

- Bedrooms = 3

- Bathrooms = 2

  

We can represent the house as:

  

$$\mathbf{x} = \begin{bmatrix} 1500\\ 3\\ 2 \end{bmatrix}$$

  

Here:

  

$$\mathbf{x} \in \mathbb{R}^3$$

  

This means that `x` is a vector containing 3 real numbers.

  

---

  

## Vector Addition

  

Two vectors of the same size can be added **element by element**.

  

Consider:

  

$$\mathbf{a} = \begin{bmatrix} 1\\ 2\\ 3 \end{bmatrix}$$

  

and

  

$$\mathbf{b} = \begin{bmatrix} 4\\ 5\\ 6 \end{bmatrix}$$

  

Then:

  

$$\mathbf{a}+\mathbf{b} = \begin{bmatrix} 1+4\\ 2+5\\ 3+6 \end{bmatrix}$$

  

Therefore:

  

$$\boxed{ \mathbf{a}+\mathbf{b} = \begin{bmatrix} 5\\ 7\\ 9 \end{bmatrix} }$$

  

**Rule:** Add corresponding elements.

  

---

  

## Scalar Multiplication

  

A **scalar** is a single number.

  

Example:

  

$$3$$

  

If we multiply a vector by a scalar:

  

$$3 \begin{bmatrix} 1\\ 2\\ 3 \end{bmatrix}$$

  

we multiply every element by `3`:

  

$$= \begin{bmatrix} 3\\ 6\\ 9 \end{bmatrix}$$

  

**General rule:**

  

For:

  

$$ c \begin{bmatrix} x_1\\ x_2\\ x_3 \end{bmatrix} $$

  

we get:

  

$$\begin{bmatrix} cx_1\\ cx_2\\ cx_3 \end{bmatrix}$$

  


  

## Vector Subtraction

  

Vectors can also be subtracted element by element.

  

Example:

  

$$\begin{bmatrix}5\\1\\3\end{bmatrix}$$

  

Calculate:

  

$$\begin{bmatrix} 4\\ 5\\ 6 \end{bmatrix}$$

  


  

## Dot Product

  

The **dot product** is one of the most important vector operations in Machine Learning.

  

Suppose:

  

$$\mathbf{x}=[1,2,3]$$

  

and:

  

$$\mathbf{w}=[4,5,6]$$

  

The dot product is:

  

$$\mathbf{x}\cdot\mathbf{w} = 1(4)+2(5)+3(6)$$

  

Calculate:

  

$$=4+10+18$$

  

Therefore:

  

$$\boxed{\mathbf{x}\cdot\mathbf{w}=32}$$

  



  

## Dot Product Formula

  

For two vectors:

  

$$\mathbf{x}=[x_1,x_2,\dots,x_n]$$

  

and:

  

$$\mathbf{w}=[w_1,w_2,\dots,w_n]$$

  

the dot product is:

  

$$\mathbf{x}\cdot\mathbf{w} = \sum_{i=1}^{n}x_iw_i$$

  

In simple terms:

  

> Multiply corresponding elements and then add the results.

  


  

## Why Dot Product Matters in ML

  

A neuron in a neural network performs an operation similar to:

  

$$z=\mathbf{w}\cdot\mathbf{x}+b$$

  

where:

  

- $\mathbf{x}$ = input vector

- $\mathbf{w}$ = weights

- $b$ = bias

- $z$ = output before activation

  

Example:

  

$$\mathbf{x}=[2,3,4]$$

  

$$\mathbf{w}=[5,1,2]$$

  

and:

  

$$b=7$$

  

Then:

  

$$z=[2,3,4]\cdot[5,1,2]+7$$

  

Calculate:

  

$$z=2(5)+3(1)+4(2)+7$$

  

$$=10+3+8+7$$

  

$$\boxed{z=28}$$

  

This simple operation is fundamental to neural networks.

  



  

## Matrices

  

A **matrix** is a rectangular arrangement of numbers.

  

Example:

  

$$A= \begin{bmatrix} 1&2&3\\ 4&5&6 \end{bmatrix}$$

  

This matrix contains:

  

- 2 rows

- 3 columns

  

Therefore its shape is:

  

$$\boxed{2\times3}$$

  

We say:

  

> A is a 2 by 3 matrix.

  


  

Consider this matrix:

  

Consider:

  

$$A= \begin{bmatrix} 1&2&3\\ 4&5&6 \end{bmatrix}$$

  

## Rows

  

Row 1:

  

$$[1,2,3]$$

  

Row 2:

  

$$[4,5,6]$$

  

## Columns

  

Column 1:

  

$$\begin{bmatrix} 1\\ 4 \end{bmatrix}$$

  

Column 2:

  

$$\begin{bmatrix} 2\\ 5 \end{bmatrix}$$

  

Column 3:

  

$$\begin{bmatrix} 3\\ 6 \end{bmatrix}$$

  



  

## Matrix Shape

  

Always pay attention to the **shape** of a matrix.

  

For:

  

$$A= \begin{bmatrix} 1&2&3\\ 4&5&6 \end{bmatrix}$$

  

the shape is:

  

$$2\times3$$

  

The first number tells us:

  

> Number of rows

  

The second number tells us:

  

> Number of columns

  

So:

  

$$\boxed{\text{Shape}=(\text{rows},\text{columns})}$$

  


  

## Vector vs Matrix

  

A column vector:

  

$$\mathbf{x}= \begin{bmatrix} 1\\ 2\\ 3 \end{bmatrix}$$

  

has shape:

  

$$3\times1$$

  

A row vector:

  

$$\mathbf{x}= \begin{bmatrix} 1&2&3 \end{bmatrix}$$

  

has shape:

  

$$1\times3$$

  

A matrix:

  

$$A= \begin{bmatrix} 1&2&3\\ 4&5&6 \end{bmatrix}$$

  

has shape:

  

$$2\times3$$

  

Understanding shapes is extremely important in Machine Learning.

  



  

## Matrix Addition

  

Two matrices can be added if they have the **same shape**.

  

Consider:

  

$$A= \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

and:

  

$$B= \begin{bmatrix} 5&6\\ 7&8 \end{bmatrix}$$

  

Then:

  

$$ A+B = \begin{bmatrix} 1+5&2+6\\ 3+7&4+8 \end{bmatrix} $$

  

Therefore:

  

$$\boxed{ A+B= \begin{bmatrix} 6&8\\ 10&12 \end{bmatrix} }$$

  

**Rule:** Matrix addition is performed **element by element**.

  



  

## Matrix Subtraction

  

Matrix subtraction works the same way.

  

Example:

  

$$A= \begin{bmatrix} 5&7\\ 9&11 \end{bmatrix}$$

  

and:

  

$$B= \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

Then:

  

$$ A-B = \begin{bmatrix} 5-1&7-2\\ 9-3&11-4 \end{bmatrix} $$

  

Therefore:

  

$$\boxed{ A-B= \begin{bmatrix} 4&5\\ 6&7 \end{bmatrix} }$$

  

---

  

## Scalar Multiplication of a Matrix

  

A matrix can also be multiplied by a scalar.

  

Example:

  

$$3 \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

Multiply every element by 3:

  

$$= \begin{bmatrix} 3&6\\ 9&12 \end{bmatrix}$$

  

---

  

## Matrix Multiplication

  

Matrix multiplication is different from matrix addition.

  

The key idea is:

  

> **Rows of the first matrix are multiplied with columns of the second matrix.**

  

Consider:

  

$$A= \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

and:

  

$$B= \begin{bmatrix} 5&6\\ 7&8 \end{bmatrix}$$

  

We want:

  

$$AB$$

  

---

  

## Matrix Multiplication — First Element

  

To calculate the top-left element of $AB$:

  

Take the first row of $A$:

  

$$[1,2]$$

  

Take the first column of $B$:

  

$$\begin{bmatrix} 5\\ 7 \end{bmatrix}$$

  

Calculate their dot product:

  

$$1(5)+2(7)$$

  

$$=5+14$$

  

$$=19$$

  

Therefore the top-left element is:

  

$$19$$

  

---

  

## Matrix Multiplication — Second Element

  

Now calculate the top-right element.

  

Take the first row of $A$:

  

$$[1,2]$$

  

Take the second column of $B$:

  

$$\begin{bmatrix} 6\\ 8 \end{bmatrix}$$

  

Calculate:

  

$$1(6)+2(8)$$

  

$$=6+16$$

  

$$=22$$

  

Therefore:

  

$$\text{top-right}=22$$

  

---

  

## Matrix Multiplication — Second Row

  

Now take the second row of $A$:

  

$$[3,4]$$

  

First column of $B$:

  

$$\begin{bmatrix} 5\\ 7 \end{bmatrix}$$

  

Calculate:

  

$$3(5)+4(7)$$

  

$$=15+28$$

  

$$=43$$

  

So:

  

$$\text{bottom-left}=43$$

  

---

  

## Final Element

  

Second row of $A$:

  

$$[3,4]$$

  

Second column of $B$:

  

$$\begin{bmatrix} 6\\ 8 \end{bmatrix}$$

  

Calculate:

  

$$3(6)+4(8)$$

  

$$=18+32$$

  

$$=50$$

  

So:

  

$$\text{bottom-right}=50$$

  

---

  

## Final Matrix Multiplication

  

Therefore:

  

$$AB= \begin{bmatrix} 19&22\\ 43&50 \end{bmatrix}$$

  

So:

  

$$\boxed{ \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix} \begin{bmatrix} 5&6\\ 7&8 \end{bmatrix} = \begin{bmatrix} 19&22\\ 43&50 \end{bmatrix} }$$

  

---

  

## Matrix Multiplication Validity

  

Suppose:

  

$$A=(m\times n)$$

  

and:

  

$$B=(n\times p)$$

  

Then:

  

$$AB=(m\times p)$$

  

The **inside dimensions must match**.

  

Think:

  

$$(m\times\boxed{n}) (\boxed{n}\times p)$$

  

The matching dimensions are the two `n`s.

  

The result uses the outside dimensions:

  

$$\boxed{m\times p}$$

  

---

  

## Example of Valid Multiplication

  

Consider:

  

$$A=(2\times3)$$

  

and:

  

$$B=(3\times4)$$

  

Can we multiply?

  

$$(2\times3)(3\times4)$$

  

Yes.

  

The inside dimensions are:

  

$$3=3$$

  

Therefore multiplication is valid.

  

The result has shape:

  

$$\boxed{2\times4}$$

  

---

  

## Example of Invalid Multiplication

  

Consider:

  

$$A=(2\times3)$$

  

and:

  

$$B=(2\times4)$$

  

Can we calculate:

  

$$ AB? $$

  

Check the inside dimensions:

  

$$(2\times\boxed{3}) (\boxed{2}\times4)$$

  

We have:

  

$$3\neq2$$

  

Therefore:

  

$$\boxed{\text{Invalid}}$$

  

The matrices cannot be multiplied in this order.

  

---

  

## Matrix Multiplication Is NOT Element-by-Element

  

This is a very common beginner mistake.

  

Suppose:

  

$$A= \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

and:

  

$$B= \begin{bmatrix} 5&6\\ 7&8 \end{bmatrix}$$

  

Matrix multiplication is **not**:

  

$$\begin{bmatrix} 1(5)&2(6)\\ 3(7)&4(8) \end{bmatrix}$$

  

That would give:

  

$$\begin{bmatrix} 5&12\\ 21&32 \end{bmatrix}$$

  

That is element-wise multiplication, not standard matrix multiplication.

  

For standard matrix multiplication:

  

> Row × Column

  

---

  

## Matrix Multiplication = Multiple Dot Products

  

This is a very useful way to think about matrix multiplication.

  

Given:

  

$$A= \begin{bmatrix} 1&2\\ 3&4 \end{bmatrix}$$

  

and:

  

$$B= \begin{bmatrix} 5&6\\ 7&8 \end{bmatrix}$$

  

Every element of $AB$ is a **dot product**.

  

For example:

  

$$(AB)_{11} = [1,2]\cdot \begin{bmatrix} 5\\ 7 \end{bmatrix}$$

  

Therefore:

  

$$(AB)_{11}=19$$

  

Similarly:

  

$$(AB)_{12}=22$$

  

$$(AB)_{21}=43$$

  

$$(AB)_{22}=50$$

  

So matrix multiplication is essentially:

  

> **A collection of dot products arranged into a matrix.**

  

---

  

## Matrix Multiplication and Neural Networks

  

This is where everything becomes important for Deep Learning.

  

Suppose we have an input:

  

$$\mathbf{x}= \begin{bmatrix} x_1\\ x_2\\ x_3 \end{bmatrix}$$

  

and weights:

  

$$\mathbf{w}= \begin{bmatrix} w_1\\ w_2\\ w_3 \end{bmatrix}$$

  

A neuron calculates:

  

$$z=\mathbf{w}^T\mathbf{x}+b$$

  

The transpose changes:

  

$$\mathbf{w}= \begin{bmatrix} w_1\\ w_2\\ w_3 \end{bmatrix}$$

  

into:

  

$$\mathbf{w}^T= \begin{bmatrix} w_1&w_2&w_3 \end{bmatrix}$$

  

Therefore:

  

$$z= \begin{bmatrix} w_1&w_2&w_3 \end{bmatrix} \begin{bmatrix} x_1\\ x_2\\ x_3 \end{bmatrix} +b$$

  

which gives:

  

$$z=w_1x_1+w_2x_2+w_3x_3+b$$

  

This is the same dot product we learned earlier.

  

---

  

## From One Neuron to Many Neurons

  

Instead of having only one neuron, suppose we have multiple neurons.

For example, let’s take **2 neurons** and **3 input features**.

  

We can represent the weights of these 2 neurons as a matrix:

  

$$W = \begin{bmatrix} w_{11} & w_{12} & w_{13} \\ w_{21} & w_{22} & w_{23} \end{bmatrix}$$

  

- Row 1 = weights for neuron 1

- Row 2 = weights for neuron 2

  

The input vector (3 features) is:

  

$$\mathbf{x} = \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix}$$

  

Then the matrix‑vector product:

  

$$W\mathbf{x} = \begin{bmatrix} w_{11} & w_{12} & w_{13} \\ w_{21} & w_{22} & w_{23} \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \\ x_3 \end{bmatrix} = \begin{bmatrix} w_{11}x_1 + w_{12}x_2 + w_{13}x_3 \\ w_{21}x_1 + w_{22}x_2 + w_{23}x_3 \end{bmatrix}$$

  

This gives a **2‑dimensional vector**, where each component is the weighted sum for one neuron.

All neurons are computed simultaneously using a single matrix multiplication.

  

This is one of the fundamental reasons matrix multiplication is so important in neural networks.

  

---

  

## Batch Processing in Machine Learning

  

Suppose we have multiple training examples.

  

For example:

  

$$X= \begin{bmatrix} x_{11}&x_{12}&x_{13}\\ x_{21}&x_{22}&x_{23}\\ x_{31}&x_{32}&x_{33} \end{bmatrix}$$

  

Each row can represent one training example (3 examples, 3 features each).

  

Suppose the weights are:

  

$$W= \begin{bmatrix} w_{11}&w_{12}\\ w_{21}&w_{22}\\ w_{31}&w_{32} \end{bmatrix}$$

  

Here we have 3 input features and 2 neurons, so W is 3×2.

  

Then:

  

$$XW$$

  

has shape:

  

$$(3\times3)(3\times2) = (3\times2)$$

  

Instead of calculating each example and neuron separately, matrix multiplication calculates them efficiently together.

  

This is what makes modern ML computation possible at scale.

  

---

  

## Shape Tracking

  

Shape tracking is a critical skill.

  

Suppose:

  

$$X=(100\times3)$$

  

and:

  

$$W=(3\times5)$$

  

Then:

  

$$XW$$

  

has shape:

  

$$(100\times3)(3\times5)$$

  

The `3`s match.

  

Therefore:

  

$$\boxed{XW=(100\times5)}$$

  

Interpretation:

  

- 100 = number of examples

- 3 = input features

- 5 = output neurons

  

So 100 examples go through a layer with 5 neurons.

  

---

  

## Another ML Example

  

Suppose:

  

$$X=(64\times784)$$

  

and:

  

$$W=(784\times128)$$

  

Then:

  

$$XW$$

  

has shape:

  

$$(64\times784)(784\times128)$$

  

The inside dimensions match:

  

$$784=784$$

  

Therefore:

  

$$\boxed{XW=(64\times128)}$$

  

Interpretation:

  

- 64 = batch size

- 784 = input features

- 128 = neurons in the layer

  

This is exactly the kind of matrix multiplication used in neural networks.

  

---

  

  

## Cheat Sheet

  

|Operation|Rule|
|---|---|
|Vector addition|Add corresponding elements|
|Vector subtraction|Subtract corresponding elements|
|Scalar × vector|Multiply every element|
|Dot product|Multiply corresponding elements, then sum|
|Matrix addition|Same shape, element-by-element|
|Matrix subtraction|Same shape, element-by-element|
|Scalar × matrix|Multiply every element|
|Matrix multiplication|Row × Column|
|Matrix multiplication validity|Inside dimensions must match|
|Result shape|Outside dimensions|

  

  

---

  

## Matrix Multiplication Dimensions

  

For:

  

$$A=(m\times n)$$

  

and:

  

$$B=(n\times p)$$

  

we have:

  

$$AB=(m\times p)$$