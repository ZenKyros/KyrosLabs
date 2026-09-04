---
title: Convolution, Kernels, Stride & Padding
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Vision
  - Neural Networks
---

# Convolutions & Stride

# Convolution, Kernels, Stride & Padding

> If you understand **Convolution + Kernel + Stride + Padding**, you understand    core mechanics behind CNNs **(Convolutional Neural Networks).**

---

# Why Do We Need Convolution?

Traditional neural networks treat every pixel independently.

For example, a:

$$
224 \times 224 \times 3
$$

image contains:

$$
224 \times 224 \times 3 = 150,528
$$

input values.

Connecting every pixel to every neuron creates:

- Huge memory usage
- Massive computation
- Overfitting
- Loss of spatial relationships

CNNs solve this by using **small learnable filters (kernels)** that scan across the image to detect meaningful patterns.

---

## What is Convolution?

Convolution is an operation where a small filter (kernel) slides across an image and computes feature values.

Instead of looking at the whole image at once, the network examines small local regions.

The result is called a **Feature Map**.

---

### Mathematical Formula

For an input image $I$ and kernel $K$:

$$
S(i,j)
=
\sum_m \sum_n
I(i+m,j+n)K(m,n)
$$

where:

- $I$ = Input image
- $K$ = Kernel (filter)
- $S$ = Output feature map

---

### Intuition

Think of a kernel as a **magnifying glass looking for a specific pattern**.

A kernel can learn:

- Edges
- Corners
- Textures
- Shapes
- Objects

Different kernels learn different visual patterns.

---

### Kernel (Filter)

A kernel is a small matrix of learnable weights.

Example:

$$
K=
\begin{bmatrix}
1 & 0 & -1 \\
1 & 0 & -1 \\
1 & 0 & -1
\end{bmatrix}
$$

This kernel emphasizes **vertical edges**.

---

### Convolution Example

Input:

$$
I=
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$

Kernel:

$$
K=
\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
$$

Output value:

$$
(1 \times 1)
+
(2 \times 0)
+
(4 \times 0)
+
(5 \times 1)
=
6
$$

The kernel then slides and repeats this operation across the image.

---

## Why Kernels Are Powerful

Early CNN layers learn:

- Edges
- Lines
- Curves

Middle CNN layers learn:

- Shapes
- Textures
- Parts of objects

Deep CNN layers learn:

- Faces
- Cars
- Animals
- Complex objects

---

## Stride

Stride determines **how many pixels the kernel moves at each step**.

---

### Stride = 1

Kernel moves one pixel at a time.

```text
Step 1 → □□□
Step 2  → □□□
Step 3   → □□□
```

Characteristics:

- More detailed information
- Larger feature maps
- Higher computation

---

### Stride = 2

Kernel jumps two pixels.

```text
Step 1 → □□□
Step 2   → □□□
Step 3     → □□□
```

Characteristics:

- Faster computation
- Smaller feature maps
- Some information loss

---

### Output Size Formula

For input size $N$:

$$
Output
=
\frac{N - F + 2P}{S} + 1
$$

where:

- $N$ = Input size
- $F$ = Kernel size
- $P$ = Padding
- $S$ = Stride

---

### Example

Input:

$$
N=7
$$

Kernel:

$$
F=3
$$

Stride:

$$
S=1
$$

Padding:

$$
P=0
$$

Output:

$$
\frac{7-3+0}{1}+1
=
5
$$

Result:

$$
5 \times 5
$$

feature map.

---

## Padding

Padding means adding extra pixels around the border of the image.

Usually zeros are added.

---

### Why Padding is Needed

Without padding:

- Output shrinks after every convolution.
- Border information is lost.
- Deep networks become difficult to train.

---

### Example

Input:

```text
□□□□□
□□□□□
□□□□□
□□□□□
□□□□□
```

Padding = 1

```text
0000000
0□□□□□0
0□□□□□0
0□□□□□0
0□□□□□0
0□□□□□0
0000000
```

The image becomes larger before convolution.

---

## Types of Padding

### 1. Valid Padding

No padding.

$$
P=0
$$

Characteristics:

- Output shrinks
- Faster computation

---

### 2. Same Padding

Padding chosen so output size remains unchanged.

For a 3×3 kernel:

$$
P=1
$$

Example:

Input:

$$
32 \times 32
$$

Output:

$$
32 \times 32
$$

---

### Why CNNs Use Padding

Padding helps:

✅ Preserve image boundaries

✅ Retain edge information

✅ Build deep architectures

✅ Avoid rapid shrinking of feature maps

---

## Putting Everything Together

Suppose:

Input:

$$
32 \times 32
$$

Kernel:

$$
3 \times 3
$$

Stride:

$$
1
$$

Padding:

$$
1
$$

Output:

$$
\frac{32-3+(2\times1)}{1}+1
=
32
$$

Output Shape:

$$
32 \times 32
$$

The feature map size remains unchanged.

---

## Feature Maps

Each kernel produces one feature map.

Example:

- 32 kernels → 32 feature maps
- 64 kernels → 64 feature maps
- 128 kernels → 128 feature maps

More kernels allow the CNN to learn more patterns.

---


## Common CNN Hyperparameters

| Hyperparameter | Purpose |
|---------------|----------|
| Kernel Size | Size of filter |
| Number of Kernels | Number of learned features |
| Stride | Movement of kernel |
| Padding | Control output size |
| Activation Function | Add non-linearity |
