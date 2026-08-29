---
title:  Pytorch Training  
type: Notes
level: Beginner 
status: 
tags:
  - mathematics 
  - linear algebra
  -  vector
---

## Training Loop

A PyTorch training loop is the process used to train a model.

The basic idea is:

```text
Data
 ↓
Model
 ↓
Prediction
 ↓
Loss
 ↓
Backward Pass
 ↓
Gradients
 ↓
Optimizer
 ↓
Updated Model
 ↓
Repeat
```

### Complete Example

```python
import torch
import torch.nn as nn


# Data
X = torch.tensor([
    [1.0],
    [2.0],
    [3.0],
    [4.0]
])

y = torch.tensor([
    [3.0],
    [5.0],
    [7.0],
    [9.0]
])


# Model
model = nn.Linear(1, 1)


# Loss function
loss_fn = nn.MSELoss()


# Optimizer
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01
)


# Training loop
for epoch in range(1000):

    # Forward pass
    predictions = model(X)

    # Calculate loss
    loss = loss_fn(predictions, y)

    # Clear old gradients
    optimizer.zero_grad()

    # Calculate gradients
    loss.backward()

    # Update parameters
    optimizer.step()

    # Show progress
    if epoch % 100 == 0:
        print(
            f"Epoch: {epoch}, Loss: {loss.item():.4f}"
        )
```

The model is learning the relationship:

```text
y = 2x + 1
```

We don't give the model this formula.

Instead, we give it examples:

```text
1 → 3
2 → 5
3 → 7
4 → 9
```

The model learns the relationship through training.


### Model

```python
model = nn.Linear(1, 1)
```

`nn.Linear` creates a simple linear layer.

Mathematically:

```text
y = xW + b
```

The model contains parameters:

```text
weight
bias
```

These parameters are initially not the values we want.

Training changes them so that the model produces better predictions.


### Forward Pass

```python
predictions = model(X)
```

The input goes through the model:

```text
X
 ↓
Model
 ↓
Prediction
```

The model uses its current `weight` and `bias` to make predictions.

At the beginning, predictions will usually be poor.

After training, predictions should become closer to the target values.


### Loss Function

```python
loss_fn = nn.MSELoss()
```

The loss function measures how wrong the model's predictions are.

```python
loss = loss_fn(predictions, y)
```

Conceptually:

```text
Prediction
     ↓
Compare
     ↑
Target
     ↓
Loss
```

A high loss means the model is making large errors.

A low loss means the predictions are closer to the targets.



### Zeroing Gradients

```python
optimizer.zero_grad()
```

PyTorch accumulates gradients by default.

Therefore, before calculating new gradients, we normally clear the old ones.

```text
Old gradients
     ↓
zero_grad()
     ↓
Clear
     ↓
Calculate new gradients
```

This line appears in most standard PyTorch training loops.


### Backward Pass

```python
loss.backward()
```

This is where PyTorch's **autograd** system calculates gradients.

PyTorch determines how the model's parameters contributed to the loss.

Conceptually:

```text
Loss
 ↓
How did weight affect the loss?
 ↓
Weight gradient

Loss
 ↓
How did bias affect the loss?
 ↓
Bias gradient
```

The gradients are stored in the model parameters.


### Optimizer

```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01
)
```

The optimizer uses the gradients to update the model's parameters.

```python
optimizer.step()
```

Conceptually:

```text
Old parameter
      ↓
Gradient
      ↓
Optimizer
      ↓
New parameter
```

For basic gradient descent:

```text
new parameter =
old parameter - learning rate × gradient
```


### Learning Rate

```python
lr=0.01
```

`lr` means **learning rate**.

It controls how large each parameter update is.

Small learning rate:

```text
Small updates
↓
Slower learning
```

Large learning rate:

```text
Large updates
↓
Potentially unstable learning
```

Choosing a good learning rate is an important part of training neural networks.

### Epoch

```python
for epoch in range(1000):
```

An **epoch** represents one complete training iteration over the training data in this simple example.

The loop repeats the learning process:

```text
Forward
 ↓
Loss
 ↓
Backward
 ↓
Update
 ↓
Repeat
```


### The Core Training Loop

This is the pattern you should recognize immediately when reading PyTorch code:

```python
for epoch in range(epochs):

    optimizer.zero_grad()

    predictions = model(X)

    loss = loss_fn(predictions, y)

    loss.backward()

    optimizer.step()
```

Think of it as:

```text
Clear
 ↓
Predict
 ↓
Measure Error
 ↓
Calculate Gradients
 ↓
Update
 ↓
Repeat
```



### Why This Matters for AI Engineering

This same basic process is used when training:

- Neural networks
    
- CNNs
    
- RNNs
    
- Transformers
    
- Language models
    
- LLMs
    

The models become much more complicated, but the fundamental training process remains:

```text
Input
 ↓
Model
 ↓
Prediction
 ↓
Loss
 ↓
Backward
 ↓
Gradients
 ↓
Optimizer
 ↓
Updated Parameters
```

This is one of the most important PyTorch patterns to understand.