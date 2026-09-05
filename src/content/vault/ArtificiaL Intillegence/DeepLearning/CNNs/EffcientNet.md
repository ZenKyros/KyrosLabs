---
title: EffcientNet
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Vision
  - Neural Networks
---


## EfficientNet — Deep Learning

EfficientNet is a family of CNN architectures designed to achieve a strong balance between **accuracy, model size, and computational cost**.

It was introduced by **Mingxing Tan and Quoc V. Le in 2019**.

The main idea is:

> **Instead of making a CNN deeper, wider, or higher-resolution independently, scale all three dimensions together in a balanced way.**


## Why EfficientNet?

Earlier CNNs often improved performance by simply making models larger.

For example:

```text
Make model deeper
      ↓
More layers

Make model wider
      ↓
More channels

Increase resolution
      ↓
Larger input images
```

But increasing only one dimension is not always efficient.

EfficientNet asks:

> **How can we increase model capacity while using computation efficiently?**

Its answer is **compound scaling**.

---

# Core Ideas

EfficientNet is mainly built around:

```text
EfficientNet
    │
    ├── Efficient building blocks
    │      ├── MBConv
    │      ├── Depthwise Convolution
    │      └── Squeeze-and-Excitation
    │
    └── Compound Scaling
           ├── Depth
           ├── Width
           └── Resolution
```

These are the concepts you should focus on.

---

# EfficientNet-B0

**EfficientNet-B0** is the baseline architecture.

The larger variants are created by scaling this baseline.

A simplified B0 structure is:

```text
Input
  ↓
Stem Conv
  ↓
MBConv Blocks
  ↓
MBConv Blocks
  ↓
MBConv Blocks
  ↓
MBConv Blocks
  ↓
MBConv Blocks
  ↓
MBConv Blocks
  ↓
MBConv
  ↓
Head Conv
  ↓
Global Average Pooling
  ↓
Fully Connected Layer
  ↓
Output
```

---

# EfficientNet-B0 Architecture

For a standard `224 × 224` input:

| Stage | Operator            | Resolution | Channels | Repeats |
| ----- | ------------------- | ---------: | -------: | ------: |
| Stem  | Conv 3×3            |    112×112 |       32 |       1 |
| 1     | MBConv1, 3×3        |    112×112 |       16 |       1 |
| 2     | MBConv6, 3×3        |      56×56 |       24 |       2 |
| 3     | MBConv6, 5×5        |      28×28 |       40 |       2 |
| 4     | MBConv6, 3×3        |      14×14 |       80 |       3 |
| 5     | MBConv6, 5×5        |      14×14 |      112 |       3 |
| 6     | MBConv6, 5×5        |        7×7 |      192 |       4 |
| 7     | MBConv6, 3×3        |        7×7 |      320 |       1 |
| Head  | Conv 1×1 + GAP + FC |        7×7 |     1280 |       1 |

> The exact stage numbering can vary between references; the important part is understanding the **MBConv structure and progressive changes in resolution/channels**.

---

# 1. Depthwise Separable Convolution

EfficientNet uses **depthwise separable convolutions** inside its MBConv blocks.

A standard convolution performs spatial and channel mixing together.

Depthwise separable convolution separates this into two operations:

```text
Depthwise Convolution
        ↓
Pointwise Convolution
```

## Depthwise Convolution

A separate spatial filter is applied to each input channel.

For example:

```text
Input:
64 channels

Depthwise Conv:
64 filters

Each filter processes one channel
```

## Pointwise Convolution

A `1×1` convolution then mixes information across channels.

```text
Depthwise Conv
      ↓
Spatial features
      ↓
1×1 Conv
      ↓
Channel mixing
```

This significantly reduces computation compared with a standard convolution.

---

# 2. MBConv

The most important building block in EfficientNet is **MBConv**, or **Mobile Inverted Bottleneck Convolution**.

It was inspired by **MobileNetV2**.

The basic idea is:

```text
Narrow
  ↓
Expand
  ↓
Process
  ↓
Compress
```

A simplified MBConv looks like:

```text
Input
  │
  ├──────────────────────────────┐
  │                              │
  ↓                              │
1×1 Conv                         │
Expand                           │
  ↓                              │
Depthwise Conv                   │
  ↓                              │
Squeeze-and-Excitation           │
  ↓                              │
1×1 Conv                         │
Project                          │
  │                              │
  └────────────── + ←────────────┘
                 ↓
               Output
```

---

# Expansion

Suppose the input has:

```text
32 channels
```

and the expansion ratio is:

```text
6
```

The block first expands:

```text
32 × 6 = 192 channels
```

So:

```text
32
 ↓
1×1 Conv
 ↓
192
```

The reason is that the depthwise convolution can perform richer feature processing in the larger feature space.

---

# Depthwise Convolution

After expansion:

```text
192 channels
      ↓
Depthwise 3×3
      ↓
192 channels
```

Unlike a normal convolution, each channel is processed independently.

This makes the operation much cheaper.

---

# Squeeze-and-Excitation (SE)

EfficientNet also uses **Squeeze-and-Excitation blocks**.

SE provides **channel attention**.

The basic idea is:

```text
Feature Maps
     ↓
Squeeze
     ↓
Channel Statistics
     ↓
Excitation
     ↓
Channel Weights
     ↓
Reweight Features
```

For example:

```text
Channel 1 → 0.2
Channel 2 → 0.9
Channel 3 → 0.4
Channel 4 → 0.8
```

Important channels receive stronger weights, while less useful channels receive smaller weights.

### Simple intuition

> **SE asks: "Which channels are important for this input?"**

---

# Projection

After feature processing, MBConv uses another `1×1` convolution to project the expanded representation back to a smaller number of channels.

```text
32
 ↓
Expand ×6
 ↓
192
 ↓
Depthwise Conv
 ↓
SE
 ↓
Project
 ↓
32
```

So the overall structure is:

```text
Input
 ↓
Expand
 ↓
Depthwise Conv
 ↓
SE
 ↓
Project
 ↓
Output
```

---

# Why is it called "Inverted Residual"?

A traditional ResNet bottleneck roughly follows:

```text
Wide
 ↓
Narrow
 ↓
Wide
```

MBConv reverses this pattern:

```text
Narrow
 ↓
Wide
 ↓
Narrow
```

Hence:

```text
ResNet Bottleneck:
Wide → Narrow → Wide

MBConv:
Narrow → Wide → Narrow
```

This is why it is called an **inverted bottleneck**.

---

# Skip Connection in MBConv

When the input and output have compatible dimensions, MBConv can use a residual connection:

```text
              ┌───────────────────────┐
              │                       │
Input ────────┤                       │
              ↓                       │
           Expand                     │
              ↓                       │
        Depthwise Conv                │
              ↓                       │
              SE                      │
              ↓                       │
           Project                    │
              │                       │
              └────────── + ←─────────┘
                         ↓
                       Output
```

So the idea remains similar to ResNet:

```text
Output = F(x) + x
```

But the internal block is much more computationally efficient.

---

# 3. Compound Scaling

This is the **signature idea of EfficientNet**.

CNNs can be scaled in three major ways:

### Width Scaling

Increase the number of channels.

```text
64 channels
    ↓
128 channels
    ↓
256 channels
```

This gives the network more feature capacity.

---

### Depth Scaling

Increase the number of layers or blocks.

```text
10 blocks
   ↓
20 blocks
   ↓
30 blocks
```

This allows the network to learn more complex representations.

---

### Resolution Scaling

Increase input image resolution.

```text
224 × 224
      ↓
300 × 300
      ↓
380 × 380
```

Higher resolution can preserve more visual information.

---

# Why Not Scale Only One?

Scaling only one dimension eventually becomes inefficient.

For example:

```text
Only Width
    ↓
More channels
    ↓
Limited benefit
```

or:

```text
Only Depth
    ↓
Very deep network
    ↓
Increasing computation
```

or:

```text
Only Resolution
    ↓
More pixels
    ↓
Higher computation
```

EfficientNet instead balances all three:

```text
        Compound Scaling
              │
      ┌───────┼───────┐
      ↓       ↓       ↓
    Depth   Width  Resolution
```

---

# Compound Scaling Formula

EfficientNet uses a compound coefficient `φ` to scale the network.

Conceptually:

```text
Depth      → α^φ
Width      → β^φ
Resolution → γ^φ
```

where:

* `φ` → overall scaling coefficient
* `α` → depth scaling factor
* `β` → width scaling factor
* `γ` → resolution scaling factor

The scaling factors are chosen so that the model grows in a balanced way.

The key idea is **not the exact formula**.

The important idea is:

> **Increase depth, width, and resolution together instead of increasing only one dimension.**

---

# EfficientNet Family

Starting from EfficientNet-B0, progressively larger models are created:

```text
B0
 ↓
B1
 ↓
B2
 ↓
B3
 ↓
B4
 ↓
B5
 ↓
B6
 ↓
B7
```

As the model increases:

```text
Model Size ↑
      ↓
Depth ↑
Width ↑
Resolution ↑
      ↓
Accuracy generally ↑
      ↓
Computation ↑
```

The goal is to achieve a better **accuracy vs computation trade-off**.

---

# EfficientNet-Lite

EfficientNet-Lite is a family designed for more resource-constrained environments such as:

* Mobile devices
* Edge devices
* On-device inference

The main goal is efficient deployment with limited computational resources.

---

# EfficientNet vs ResNet

| Feature          | ResNet                  | EfficientNet            |
| ---------------- | ----------------------- | ----------------------- |
| Main idea        | Residual learning       | Efficient scaling       |
| Main block       | Residual Block          | MBConv                  |
| Depthwise Conv   | ❌                       | ✅                       |
| SE Attention     | ❌                       | ✅                       |
| Skip Connections | ✅                       | ✅                       |
| Scaling strategy | Different architectures | Compound scaling        |
| Efficiency       | Good                    | Very high               |
| Typical use      | General CNN backbone    | Efficient vision models |

The important distinction:

```text
ResNet
   ↓
"How can we train deeper networks?"

EfficientNet
   ↓
"How can we scale CNNs efficiently?"
```

---

# EfficientNet Mental Model

Think of EfficientNet as combining several ideas:

```text
                    EfficientNet
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       MBConv       Efficient Conv      SE
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                 Compound Scaling
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
            Depth      Width    Resolution
```

