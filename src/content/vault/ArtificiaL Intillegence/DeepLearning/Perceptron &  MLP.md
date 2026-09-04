---
title:  Perceptron & MLP  
type: Notes
level: Beginner 
status: 
tags:
  - programming  
  - Deep Learning
  - python
  - Neural Networks
---

## What is a Perceptron?

A **Perceptron** is the simplest form of a neural network used for **binary classification (0 or 1)**. It combines inputs with weights, adds a bias, and applies an activation function to make a decision.

### One-Line Definition
> A perceptron is a single artificial neuron that learns a linear decision boundary to classify inputs into two categories.
![An Illustration of Perceptron](image_1.png)

## Core Components

### 1. Inputs (x₁, x₂, ..., xₙ)

- Features of the data.
- Provide information used for prediction.

**Example:** OR gate inputs `(0,1)`.



### 2. Weights (w₁, w₂, ..., wₙ)

- Represent the importance of each input.
- Larger weight = greater influence on the output.
- Learned during training.


### 3. Bias (b)

- A constant added to the weighted sum.
- Helps shift the decision boundary.
- Allows predictions even when all inputs are zero.



### 4. Weighted Sum

The perceptron computes:

$z = \sum_{i=1}^{n} w_i x_i + b$

where:

- $x_i$ = input
- $w_i$ = weight
- $b$ = bias

### 5. Activation Function (Step Function)

Converts the weighted sum into a binary output.

$\hat{y} = \begin{cases} 1, & z \ge 0 \\ 0, & z < 0 \end{cases}$

## How a Perceptron Works

### Step 1: Compute Weighted Sum

$z = \sum_{i=1}^{n} w_i x_i + b$

### Step 2: Apply Activation Function

$\hat{y} = \begin{cases} 1, & z \ge 0 \\ 0, & z < 0 \end{cases}$

### Step 3: Calculate Error

$\text{Error} = y - \hat{y}$

where:

- $y$ = actual output
- $\hat{y}$ = predicted output

### Step 4: Update Weights

$w_i = w_i + \eta(y - \hat{y})x_i$

### Step 5: Update Bias

$b = b + \eta(y - \hat{y})$

### Step 6: Repeat

- Process all training samples.
- Repeat for multiple epochs until errors are minimized.


## Perceptron vs Neural Network

| Perceptron | Neural Network |
|------------|---------------|
| Single neuron | Multiple layers of neurons |
| Linear decision boundary | Non-linear decision boundaries |
| Binary classification | Classification & Regression |
| Simple architecture | Complex architecture |
| Cannot solve XOR | Can solve complex problems |


## Quick Summary

A perceptron takes inputs, multiplies them by weights, adds a bias, applies a step activation function, and outputs either **0 or 1**. During training, it updates its weights and bias based on prediction errors to learn a **linear decision boundary**.

---

# Multi-Layer Perceptron (MLP) Notes

A **Multi-Layer Perceptron (MLP)** consists of fully connected dense layers that transform input data dimensions to model complex non-linear relationships.
![An Illustration of MLP](image.png)
---

## Components of an MLP

* **Input Layer:** Nodes correspond exactly to the number of input features.
* **Hidden Layers:** One or more intermediate layers processing representations.
* **Output Layer:** Generates the final prediction mapping to the target format.


##  Core Mechanics

### 1. Forward Propagation
Data flows sequentially from the input layer to the output layer. Each hidden neuron processes inputs through two distinct operations:

* **Weighted Sum:**
  $z = \sum_{i} w_i x_i + b$
  *(where $x_i$ is the input feature, $w_i$ is the weight, and $b$ is the bias)*

* **Activation Function:** Introduces non-linearity to the network:
  * **Sigmoid:** $\sigma(z) = \frac{1}{1 + e^{-z}}$
  * **ReLU (Rectified Linear Unit):** $f(z) = \max(0, z)$
  * **Tanh (Hyperbolic Tangent):** $\tanh(z) = \frac{2}{1 + e^{-2z}} - 1$

### 2. Loss Functions
Measures the error variance between the predicted label ($\hat{y}_i$) and actual label ($y_i$) across $N$ total samples:

* **Binary Cross-Entropy (Classification):**
  $L = -\frac{1}{N} \sum_{i=1}^{N} [y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i)]$

* **Mean Squared Error (Regression):**
  $\text{MSE} = \frac{1}{N} \sum_{i=1}^{N} (y_i - \hat{y}_i)^2$

### 3. Backpropagation
Minimizes the loss function by computing derivatives layer-by-layer backwards using the calculus **Chain Rule**:

* **Weight Update Formula:**
  $w = w - \eta \cdot \frac{\partial L}{\partial w}$
  *(where $\eta$ is the learning rate and $\frac{\partial L}{\partial w}$ is the gradient)*

### 4. Optimization Algorithms

* **Stochastic Gradient Descent (SGD):** Updates weights iteratively based on mini-batches:
  $w = w - \eta \cdot \frac{\partial L}{\partial w}$

* **Adam Optimizer:** Dynamically tracks gradients using running averages of momentum ($m_t$) and adaptive learning scales ($v_t$):
  $m_t = \beta_1 m_{t-1} + (1 - \beta_1) \cdot g_t$
  $v_t = \beta_2 v_{t-1} + (1 - \beta_2) \cdot g_t^2$
  *(where $g_t$ represents the calculated gradient at timestep $t$, and $\beta_1, \beta_2$ act as exponential decay factors)*
