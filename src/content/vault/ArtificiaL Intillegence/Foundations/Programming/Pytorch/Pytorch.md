---
title:  Pytorch  
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear algebra
  -  vector
---
## What is PyTorch?

**PyTorch** is a Python-based deep learning framework used to build and train machine learning and deep learning models.

It provides:

- **Tensors** — multidimensional arrays
    
- **GPU acceleration** — fast computation on GPUs
    
- **Automatic differentiation** — calculates gradients automatically
    
- **Neural network building blocks** — `torch.nn`
    
- **Optimizers** — `torch.optim`
    
- **Data loading** — `Dataset` and `DataLoader`
    

### Why PyTorch matters for AI Engineering

The basic relationship is:

```text
NumPy
  ↓
Arrays & Numerical Computing
  ↓
PyTorch
  ↓
Tensors + GPU + Autograd
  ↓
Deep Learning
  ↓
Neural Networks
  ↓
Transformers
  ↓
LLMs
  ↓
AI Engineering
```

## Importing PyTorch

```python
import torch
```

Check the installed version:

```python
print(torch.__version__)
```


## NumPy vs PyTorch

If you already know NumPy, PyTorch will feel familiar.

|NumPy|PyTorch|
|---|---|
|`np.array()`|`torch.tensor()`|
|`ndarray`|`Tensor`|
|`arr.shape`|`tensor.shape`|
|`arr.dtype`|`tensor.dtype`|
|`arr.reshape()`|`tensor.reshape()`|
|`arr.T`|`tensor.T`|
|`np.mean()`|`torch.mean()`|
|`np.sum()`|`torch.sum()`|
|`np.max()`|`torch.max()`|
|`np.min()`|`torch.min()`|
|`np.sqrt()`|`torch.sqrt()`|
|`np.exp()`|`torch.exp()`|
|`np.log()`|`torch.log()`|
|`np.matmul()`|`torch.matmul()`|

### The important difference

A NumPy array is mainly for numerical computing.

A PyTorch tensor additionally supports:

```text
Tensor
 ├── CPU computation
 ├── GPU computation
 └── Automatic differentiation
```

These capabilities make PyTorch extremely useful for Deep Learning.


## PyTorch Tensor

The fundamental data structure in PyTorch is the **Tensor**.

A tensor is a multidimensional array.

```python
x = torch.tensor([1, 2, 3])

print(x)
```

Output:

```text
tensor([1, 2, 3])
```

### 1D Tensor

```python
x = torch.tensor([1, 2, 3])
```

Shape:

```text
[3]
```

### 2D Tensor

```python
x = torch.tensor([
    [1, 2, 3],
    [4, 5, 6]
])
```

Shape:

```text
[2, 3]
```


### 3D Tensor

```python
x = torch.tensor([
    [
        [1, 2],
        [3, 4]
    ],
    [
        [5, 6],
        [7, 8]
    ]
])
```

Shape:

```text
[2, 2, 2]
```



### Tensor Shape

Shape tells us the size of every dimension.

```python
x = torch.tensor([
    [1, 2, 3],
    [4, 5, 6]
])

print(x.shape)
```

Output:

```text
torch.Size([2, 3])
```

Meaning:

```text
2 rows
3 columns
```

### Important

Understanding tensor shapes is one of the **most important PyTorch skills**.

You will constantly see errors such as:

```text
Expected shape ...
but got shape ...
```

Learning to read shapes is essential for AI Engineering.


## Tensor Dimensions

Get the number of dimensions:

```python
x.ndim
```

Example:

```python
x = torch.tensor([
    [1, 2],
    [3, 4]
])

print(x.ndim)
```

Output:

```text
2
```

Relationship:

```text
x.ndim
    ↓
number of dimensions

x.shape
    ↓
size of each dimension
```



### Number of Elements

Use:

```python
x.numel()
```

Example:

```python
x = torch.tensor([
    [1, 2, 3],
    [4, 5, 6]
])

print(x.numel())
```

Output:

```text
6
```

Because:

```text
2 × 3 = 6
```


## Tensor Data Types

PyTorch tensors have a data type (`dtype`).

```python
x = torch.tensor([1, 2, 3])

print(x.dtype)
```

Common data types:

```python
torch.float32
torch.float64
torch.float16
torch.bfloat16

torch.int32
torch.int64

torch.bool
```

For example:

```python
x = torch.tensor(
    [1, 2, 3],
    dtype=torch.float32
)
```



###  Why `dtype` Matters in AI

Neural networks perform huge numbers of mathematical operations.

The choice of dtype affects:

- Memory usage
    
- Speed
    
- Numerical precision
    
- GPU performance
    

Common AI-related dtypes include:

```text
float32
float16
bfloat16
```

Especially important when working with:

- GPUs
    
- Mixed precision
    
- Large neural networks
    
- LLMs
    


## Creating Tensors

### Zeros

```python
torch.zeros(3)
```

```python
torch.zeros((3, 4))
```


### Ones

```python
torch.ones(3)
```

```python
torch.ones((3, 4))
```



### Full

```python
torch.full((2, 3), 8)
```

Creates:

```text
[[8, 8, 8],
 [8, 8, 8]]
```


### Identity Matrix

```python
torch.eye(5)
```

Creates a `5 × 5` identity matrix.


### Range

```python
torch.arange(0, 10, 2)
```

Output:

```text
tensor([0, 2, 4, 6, 8])
```



### Evenly Spaced Values

```python
torch.linspace(0, 10, 5)
```

Output:

```text
tensor([ 0.0000,  2.5000,  5.0000,  7.5000, 10.0000])
```


## Random Tensors

Random tensors are extremely important in Deep Learning.

### Uniform Random Values

```python
torch.rand(3, 3)
```

Values are approximately between:

```text
0 and 1
```


### Normally Distributed Values

```python
torch.randn(3, 3)
```

Values are sampled from a standard normal distribution.

This is frequently useful for initialization and experimentation.


### Random Integers

```python
torch.randint(
    0,
    10,
    (3, 3)
)
```

Generates random integers from `0` up to but excluding `10`.


## Reproducibility
Random operations can produce different results each time.

Set a random seed:

```python
torch.manual_seed(42)
```

Now repeated random operations can be reproduced under the same conditions.


## Inspecting a Tensor

```python
x = torch.randn(3, 4)

print(x)
print(x.shape)
print(x.ndim)
print(x.numel())
print(x.dtype)
```

A useful mental checklist:

```text
Tensor
 ↓
What is its shape?
 ↓
How many dimensions?
 ↓
How many elements?
 ↓
What dtype?
 ↓
Which device?
 ↓
Does it require gradients?
```

The last two become especially important later.



## Indexing

PyTorch indexing is very similar to NumPy.

```python
x = torch.tensor([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])
```

First element:

```python
x[0]
```

First row:

```python
x[0, :]
```

Second column:

```python
x[:, 1]
```

Specific element:

```python
x[1, 2]
```

Output:

```text
6
```


## Slicing

```python
x = torch.tensor([1, 2, 3, 4, 5])
```

First three:

```python
x[:3]
```

From index 2:

```python
x[2:]
```

Every second element:

```python
x[::2]
```



### Boolean Indexing

```python
x = torch.tensor([1, 4, 7, 2, 9])
```

Create a condition:

```python
x < 5
```

Filter:

```python
x[x < 5]
```

Output:

```text
tensor([1, 4, 2])
```

This becomes useful for data preprocessing and tensor manipulation.



## Basic Tensor Mathematics

```python
a = torch.tensor([1, 2, 3])
b = torch.tensor([4, 5, 6])
```

Addition:

```python
a + b
```

Subtraction:

```python
a - b
```

Element-wise multiplication:

```python
a * b
```

Division:

```python
a / b
```

Power:

```python
a ** 2
```


### Mathematical Functions

```python
x = torch.tensor([1., 4., 9.])
```

Square root:

```python
torch.sqrt(x)
```

Exponential:

```python
torch.exp(x)
```

Logarithm:

```python
torch.log(x)
```

Absolute value:

```python
torch.abs(x)
```

Rounding:

```python
torch.round(x)
torch.floor(x)
torch.ceil(x)
```

