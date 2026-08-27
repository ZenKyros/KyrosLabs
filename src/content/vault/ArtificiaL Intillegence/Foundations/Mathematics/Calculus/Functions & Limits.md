---
title: Functions & Limits   
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - Calculas
  - Vector 
---
## Functions & Limits

### Function

A function maps an input to an output:

$$
y=f(x)
$$

Example:

$$
f(x)=x^2
$$

In ML, a model can be viewed as a function:

$$
\hat{y}=f(x;\theta)
$$

where \(\theta\) represents model parameters.

### Limit

A limit describes what a function approaches as its input approaches a particular value:

$$
\lim_{x\to a}f(x)
$$

Limits are the foundation for defining derivatives.


## Derivatives

A derivative measures the **rate of change** of a function.

$$
\frac{dy}{dx}
$$

Example:

$$
f(x)=x^2
$$

Then:

$$
f'(x)=2x
$$

### AI connection

Derivatives tell us:

> "If I slightly change this parameter, how does the loss change?"

This is essential for training neural networks.


## Partial Derivatives

When a function has multiple variables, we differentiate with respect to one variable while treating the others as constants.

For:

$$
f(x,y)=x^2+3y^2
$$

Partial derivatives:

$$
\frac{\partial f}{\partial x}=2x
$$

$$
\frac{\partial f}{\partial y}=6y
$$

In ML, loss functions usually depend on **many parameters**, so partial derivatives are fundamental.



## Gradients & Directional Derivatives

###  Gradient Vector

The **gradient** of a multivariable function $f$ pools all its first-order partial derivatives into a column vector:

$$\boxed{ \nabla f = \begin{bmatrix} \dfrac{\partial f}{\partial x_1} \\[0.8em] \dfrac{\partial f}{\partial x_2} \\[0.8em] \vdots \\[0.5em] \dfrac{\partial f}{\partial x_n} \end{bmatrix} }$$

* **$\nabla$ (Nabla):** Represents the vector differential operator.
* **Geometric Meaning:** The gradient vector points in the direction of the **steepest ascent** of the function, and its magnitude tells you the rate of that slope.


The gradient points in the direction of **steepest increase**.

Therefore, to decrease a loss, we move in the opposite direction:

$$
-\nabla L
$$

### Directional derivative

Measures how quickly a function changes in a particular direction \(u\):

$$
D_u f=\nabla f^T u
$$


