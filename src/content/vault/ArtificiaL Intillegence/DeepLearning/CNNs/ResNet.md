---
title: ResNet Architecture
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Vision
  - Neural Networks
---

## Residual Networks (ResNet) - Deep Learning

Residual Networks (**ResNet**) are deep learning architectures designed to make training very deep neural networks easier and more effective.

The key idea behind ResNet is the use of **skip (shortcut) connections**, which allow the network to learn **residual mappings** instead of learning the complete transformation directly.

### Key Ideas

* Helps reduce the difficulty of training very deep networks
* Allows information and gradients to flow through shortcut connections
* Introduces **residual learning**
* Enables networks with dozens or even hundreds of layers
* Uses fewer parameters than architectures such as VGG for similar or better performance

---

# Challenges in Deep Neural Networks

As neural networks become deeper, training becomes increasingly difficult. Two important problems are:

## 1. Vanishing / Exploding Gradient Problem

During backpropagation, gradients are repeatedly multiplied as they pass through many layers.

This can cause gradients to:

* Become extremely small → **Vanishing Gradient**
* Become extremely large → **Exploding Gradient**

When gradients become too small, early layers learn very slowly.

---

## 2. Degradation Problem

The **degradation problem** occurs when simply adding more layers causes the network's training performance to become worse.

This is different from overfitting.

For example:

```text
Shallower Network
      ↓
Lower Training Error

Deeper Plain Network
      ↓
Higher Training Error
```

A deeper network should theoretically be able to perform at least as well as a shallower one because it could simply learn an identity mapping for the additional layers.

However, in practice, optimizing such a plain deep network becomes difficult.

**ResNet was designed to solve this problem using residual learning and skip connections.**

---

# What is Residual Learning?

A traditional neural network tries to learn the complete desired mapping:

```text
H(x)
```

ResNet instead learns a **residual function**:

```text
F(x) = H(x) - x
```

Therefore:

```text
H(x) = F(x) + x
```

This is the central idea of ResNet.

Where:

* `x` → input to the residual block
* `H(x)` → desired output mapping
* `F(x)` → residual function learned by the convolutional layers

Instead of forcing the layers to learn the entire transformation, they only need to learn the **difference between the input and desired output**.

---

# Skip Connection

A **skip connection**, also called a **shortcut connection**, bypasses one or more layers and sends the input directly toward the output.

Conceptually:

```text
             ┌───────────────┐
             │               │
             │      x        │
             ↓               │
        Conv → BN → ReLU     │
             ↓               │
        Conv → BN            │
             ↓               │
             + ←─────────────┘
             ↓
           ReLU
             ↓
          Output
```

The output is:

```text
Output = F(x) + x
```

The shortcut provides a direct path for both **information** and **gradients**.

---

# Why Skip Connections Help

Without a shortcut:

```text
x → Layer → Layer → Layer → Layer → Output
```

The information and gradients must pass through every layer.

With a shortcut:

```text
       ┌──────────────────────┐
       │                      │
x ────→│ Layers ──────────────┼──→ Add → Output
       │                      │
       └──────────────────────┘
```

The input has a more direct path to the output.

This makes optimization easier and helps very deep networks train effectively.

---

# Residual Block

The **residual block** is the fundamental building block of ResNet.

A basic residual block typically contains:

1. Convolution
2. Batch Normalization
3. ReLU
4. Convolution
5. Batch Normalization
6. Add the shortcut
7. ReLU

Conceptually:

```text
Input x
   │
   ├─────────────────────────────┐
   │                             │
   ↓                             │
 Conv 3×3                        │
   ↓                             │
 BatchNorm                       │
   ↓                             │
 ReLU                            │
   ↓                             │
 Conv 3×3                        │
   ↓                             │
 BatchNorm                       │
   ↓                             │
   + ←───────────────────────────┘
   ↓
 ReLU
   ↓
Output
```

Mathematically:

```text
Output = ReLU(F(x) + x)
```

---

# Dimension Matching

For addition to work:

```text
F(x) + x
```

both tensors must have the **same shape**.

For example:

```text
F(x) = [64, 56, 56]
x    = [64, 56, 56]

        ↓

F(x) + x
```

This works because their dimensions match.

But suppose:

```text
F(x) = [128, 28, 28]
x    = [64, 56, 56]
```

They cannot be added directly.

ResNet therefore uses a **projection shortcut** when dimensions change.

---

# Projection Shortcut

A common solution is a **1×1 convolution** in the shortcut path.

```text
Input x
   │
   ├─────────────────────────────┐
   │                             │
   ↓                             ↓
 Conv 3×3                     Conv 1×1
   ↓                             ↓
 BatchNorm                    BatchNorm
   ↓                             │
 Conv 3×3                        │
   ↓                             │
 BatchNorm                        │
   │                             │
   └────────────── + ←───────────┘
                  ↓
                ReLU
```

The `1×1` convolution can change:

* Number of channels
* Spatial dimensions when used with `stride > 1`

For example:

```text
64 × 56 × 56
      ↓
1×1 Conv, stride=2
      ↓
128 × 28 × 28
```

Now the shortcut and residual path can be added.

---

# Zero-Padding Shortcut

The original ResNet paper also describes another option for matching dimensions:

* Increase the number of channels using zero-padding
* Downsample the spatial dimensions when necessary

However, in practical implementations, **projection shortcuts using 1×1 convolutions are very common**.

For implementation purposes, you should focus mainly on the **1×1 projection shortcut**.

---

# Stacking Residual Blocks

A ResNet is created by stacking many residual blocks.

```text
Input
  ↓
Residual Block
  ↓
Residual Block
  ↓
Residual Block
  ↓
Residual Block
  ↓
...
  ↓
Global Average Pooling
  ↓
Fully Connected Layer
  ↓
Output
```

Because each block contains a shortcut connection, many blocks can be stacked while maintaining effective information and gradient flow.

---

# ResNet-34

**ResNet-34** contains **34 layers** and uses **Basic Residual Blocks**.

Its residual blocks are organized into four main stages:

| Stage   | Blocks | Filters |
| ------- | -----: | ------: |
| Stage 1 |      3 |      64 |
| Stage 2 |      4 |     128 |
| Stage 3 |      6 |     256 |
| Stage 4 |      3 |     512 |

Total residual blocks:

```text
3 + 4 + 6 + 3 = 16 blocks
```

Each BasicBlock contains **2 convolutional layers**:

```text
16 × 2 = 32 convolutional layers
```

Then:

```text
Initial convolution = 1
Final fully connected layer = 1

32 + 1 + 1 = 34 layers
```

So:

```text
ResNet-34
    │
    ├── Initial Conv
    │
    ├── 3 BasicBlocks
    ├── 4 BasicBlocks
    ├── 6 BasicBlocks
    ├── 3 BasicBlocks
    │
    ├── Global Average Pooling
    │
    └── Fully Connected Layer
```

---

# ResNet-34 Feature Map Sizes

For a standard `224 × 224` input:

```text
Input
3 × 224 × 224
      ↓
Initial Conv
64 × 112 × 112
      ↓
Stage 1
64 × 56 × 56
      ↓
Stage 2
128 × 28 × 28
      ↓
Stage 3
256 × 14 × 14
      ↓
Stage 4
512 × 7 × 7
```

The spatial dimensions decrease while the number of channels increases.

This allows the network to gradually move from:

```text
Low-level features
      ↓
Edges
      ↓
Textures
      ↓
Patterns
      ↓
Shapes
      ↓
High-level semantic features
```

---

# Global Average Pooling (GAP)

After the final convolutional stage, ResNet uses **Global Average Pooling**.

For ResNet-34:

```text
512 × 7 × 7
      ↓
Global Average Pooling
      ↓
512 × 1 × 1
      ↓
Flatten
      ↓
512
```

Each feature map is reduced to a single value by taking the average of all its spatial values.

For one feature map:

```text
7 × 7
 ↓
Average
 ↓
1 value
```

For 512 feature maps:

```text
512 × 7 × 7
      ↓
512 values
```

### Why GAP?

GAP:

* Reduces the number of parameters
* Produces a compact feature representation
* Reduces the need for large fully connected layers
* Can help reduce overfitting

---

# ResNet Architecture Family

ResNet comes in several standard versions:

| Model      | Block Type | Blocks per Stage |
| ---------- | ---------- | ---------------- |
| ResNet-18  | BasicBlock | 2, 2, 2, 2       |
| ResNet-34  | BasicBlock | 3, 4, 6, 3       |
| ResNet-50  | Bottleneck | 3, 4, 6, 3       |
| ResNet-101 | Bottleneck | 3, 4, 23, 3      |
| ResNet-152 | Bottleneck | 3, 8, 36, 3      |

The important distinction is:

```text
ResNet-18 / 34
      ↓
BasicBlock

ResNet-50 / 101 / 152
      ↓
Bottleneck Block
```

---

# BasicBlock vs Bottleneck

## BasicBlock

Used mainly in:

```text
ResNet-18
ResNet-34
```

Structure:

```text
3×3 Conv
   ↓
BatchNorm
   ↓
ReLU
   ↓
3×3 Conv
   ↓
BatchNorm
   ↓
Add Shortcut
   ↓
ReLU
```

---

## Bottleneck Block

Used mainly in:

```text
ResNet-50
ResNet-101
ResNet-152
```

Structure:

```text
1×1 Conv
   ↓
3×3 Conv
   ↓
1×1 Conv
   ↓
Add Shortcut
   ↓
ReLU
```

The `1×1` convolutions reduce and then restore the channel dimensions.

Example:

```text
256 channels
     ↓
1×1 Conv
     ↓
64 channels
     ↓
3×3 Conv
     ↓
64 channels
     ↓
1×1 Conv
     ↓
256 channels
```

This allows deeper networks to be built more efficiently.

---

# Important ResNet Concepts to Master

As an AI Engineer, focus on understanding these concepts rather than memorizing every layer:

### Must Know

* Why ResNet was introduced
* Degradation problem
* Residual learning
* `H(x) = F(x) + x`
* Skip / shortcut connections
* Identity shortcut
* Projection shortcut
* 1×1 convolution
* BasicBlock
* Bottleneck Block
* Batch Normalization
* Global Average Pooling
* ResNet-18 architecture
* ResNet-34 architecture
* ResNet-50 architecture
* Transfer learning with pretrained ResNet

### Understand Conceptually

* ResNet-101
* ResNet-152
* Historical comparison with VGG
* Exact parameter counts
* Exact layer-by-layer configurations

You do **not** need to memorize every individual layer of ResNet-101 or ResNet-152.

---

# ResNet vs VGG

| Feature                | VGG                  | ResNet            |
| ---------------------- | -------------------- | ----------------- |
| Main idea              | Stacked convolutions | Residual learning |
| Skip connections       | ❌                    | ✅                 |
| Very deep networks     | Difficult            | Much easier       |
| Main block             | Conv layers          | Residual block    |
| Fully connected layers | Large                | Much smaller      |
| Parameter efficiency   | Lower                | Higher            |
| Training deep networks | Difficult            | Easier            |

---

# Mental Model

Think of a normal deep network as:

```text
Input
  ↓
Transform
  ↓
Transform
  ↓
Transform
  ↓
Transform
  ↓
Output
```

ResNet adds a shortcut:

```text
              ┌──────────────────────┐
              │                      │
Input ────────┼──→ Transformations ──┼──→ Add
              │                      │
              └──────────────────────┘
                         ↓
                       Output
```

Instead of forcing the layers to learn:

```text
H(x)
```

they learn:

```text
F(x)
```

and the original input is added back:

```text
H(x) = F(x) + x
```

That simple idea is the core of ResNet.

---

# 80/20 Summary

If you remember only a few things about ResNet, remember these:

```text
ResNet
  ↓
Solves the difficulty of training very deep networks
  ↓
Uses Skip Connections
  ↓
Learns Residual Functions
  ↓
F(x) + x
  ↓
Better information + gradient flow
```

The most important equation is:

```text
H(x) = F(x) + x
```

The most important component is:

```text
Residual Block
```

And the most important architectural idea is:

```text
Input ────────────────┐
  ↓                   │
Conv → BN → ReLU      │
  ↓                   │
Conv → BN             │
  ↓                   │
  + ←─────────────────┘
  ↓
ReLU
```

**Core takeaway:** ResNet does not simply make CNNs deeper. It makes **deep networks easier to optimize** by giving information and gradients a shortcut through the network.
