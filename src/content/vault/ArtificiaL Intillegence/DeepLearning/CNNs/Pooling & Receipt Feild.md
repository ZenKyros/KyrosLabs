---
title: Pooling & Receptive Fields
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Vision
  - Neural Networks
---

# Pooling & Receptive Fields

> If you understand **Pooling** and **Receptive Fields**, you'll understand how CNNs reduce computation and gradually learn larger, more meaningful features from images.

---

## 1. Pooling

Pooling is a downsampling operation used in CNNs to reduce the spatial dimensions (height and width) of feature maps while retaining the most important information.

It helps:

- Reduce computation
- Reduce memory usage
- Reduce overfitting
- Make features more robust to small shifts and distortions

---

### Why Pooling is Needed

After convolution, feature maps can become very large.

Example:

$$
224 \times 224 \times 64
$$

Processing such large feature maps through many layers is computationally expensive.

Pooling reduces the size while preserving important patterns.

---

### Intuition

Imagine looking at a photo from far away.

Even though some details disappear, you can still recognize:

- Faces
- Cars
- Animals
- Buildings

Pooling performs a similar operation by keeping the most important information and discarding less useful details.

---

## Types of Pooling

### 1. Max Pooling

The most commonly used pooling technique.

It selects the largest value from each pooling window.

### Example

Input:

$$
\begin{bmatrix}
1 & 3 \\
5 & 2
\end{bmatrix}
$$

Max Pooling:

$$
\max(1,3,5,2)=5
$$

Output:

$$
[5]
$$

---

### Larger Example

Input:

$$
\begin{bmatrix}
1 & 3 & 2 & 1 \\
5 & 6 & 1 & 2 \\
4 & 2 & 8 & 7 \\
3 & 1 & 2 & 5
\end{bmatrix}
$$

2×2 Max Pooling with Stride = 2

Window 1:

$$
\begin{bmatrix}
1 & 3 \\
5 & 6
\end{bmatrix}
\rightarrow 6
$$

Window 2:

$$
\begin{bmatrix}
2 & 1 \\
1 & 2
\end{bmatrix}
\rightarrow 2
$$

Window 3:

$$
\begin{bmatrix}
4 & 2 \\
3 & 1
\end{bmatrix}
\rightarrow 4
$$

Window 4:

$$
\begin{bmatrix}
8 & 7 \\
2 & 5
\end{bmatrix}
\rightarrow 8
$$

Output:

$$
\begin{bmatrix}
6 & 2 \\
4 & 8
\end{bmatrix}
$$

---

### Why Max Pooling Works

The strongest activation often represents the most important detected feature.

For example:

- Edge detected strongly → keep it
- Weak activations → ignore them

Thus Max Pooling preserves dominant features.

---

## 2. Average Pooling

Instead of taking the maximum value, Average Pooling computes the mean value.

### Example

Input:

$$
\begin{bmatrix}
1 & 3 \\
5 & 7
\end{bmatrix}
$$

Output:

$$
\frac{1+3+5+7}{4}
=
4
$$

---

### Max Pooling vs Average Pooling

| Method | Operation | Preserves |
|----------|----------|----------|
| Max Pooling | Largest value | Strongest feature |
| Average Pooling | Mean value | Overall information |

**In modern CNNs, Max Pooling is used much more frequently.**

---

## Pooling Output Size Formula

The pooling output size follows the same formula used in convolutions:

$$
Output
=
\frac{N-F+2P}{S}+1
$$

where:

- $N$ = Input size
- $F$ = Pooling window size
- $P$ = Padding
- $S$ = Stride

---

## Example

Input:

$$
N=8
$$

Pooling Window:

$$
F=2
$$

Stride:

$$
S=2
$$

Padding:

$$
P=0
$$

Output:

$$
\frac{8-2+0}{2}+1
=
4
$$

Result:

$$
4 \times 4
$$

feature map.

---

### What Pooling Achieves

Suppose:

Input:

$$
32 \times 32
$$

Apply:

- Pool Size = 2×2
- Stride = 2

Output:

$$
16 \times 16
$$

Area reduced by:

$$
75\%
$$

This makes CNNs much faster.

---

## Global Average Pooling (GAP)

Modern architectures often replace dense layers with Global Average Pooling.

It converts:

$$
H \times W \times C
$$

into:

$$
1 \times 1 \times C
$$

by averaging each feature map.

Example:

$$
7 \times 7 \times 512
\rightarrow
1 \times 1 \times 512
$$

Benefits:

- Fewer parameters
- Less overfitting
- Faster models

---

## 2. Receptive Fields

### What is a Receptive Field?

A receptive field is the region of the original image that influences a particular neuron.

Simply put:

> A receptive field tells us how much of the input image a neuron can "see."

---

### Human Vision Analogy

When reading a book:

- Your eye focuses on a few letters.
- Then a word.
- Then a sentence.
- Then an entire paragraph.

CNNs work similarly.

Early layers see small regions.

Deeper layers see increasingly larger regions.

---

## Receptive Field in CNNs

Suppose we use a:

$$
3 \times 3
$$

kernel.

A neuron in the first convolution layer sees:

$$
3 \times 3
$$

pixels.

Its receptive field is:

$$
3 \times 3
$$

---

### After Another Convolution

Apply another:

$$
3 \times 3
$$

convolution.

The neurons now indirectly see:

$$
5 \times 5
$$

pixels of the original image.

Receptive field grows.

---

### Growth Example

Layer 1:

$$
3 \times 3
$$

Receptive Field:

$$
3 \times 3
$$

---

Layer 2:

$$
3 \times 3
$$

Receptive Field:

$$
5 \times 5
$$

---

Layer 3:

$$
3 \times 3
$$

Receptive Field:

$$
7 \times 7
$$

---

Layer 4:

$$
3 \times 3
$$

Receptive Field:

$$
9 \times 9
$$

---

As depth increases:

$$
3 \rightarrow 5 \rightarrow 7 \rightarrow 9
$$

The network gains a broader understanding of the image.

---

## Why Large Receptive Fields Matter

To recognize:

### Edge

Only a tiny region is needed.

### Eye

Need a larger region.

### Face

Need an even larger region.

### Entire Person

Need a much larger region.

Thus deeper layers require larger receptive fields.

---

## Pooling and Receptive Fields

Pooling increases the effective receptive field rapidly.

Example:

```text
Image
 ↓
Conv
 ↓
Conv
 ↓
Pooling
 ↓
Conv
 ↓
Conv
```

After pooling, each neuron corresponds to a larger portion of the original image.

Thus CNNs learn global information faster.

---

## Local Features → Global Features

Early Layers Learn:

- Edges
- Corners
- Lines

Middle Layers Learn:

- Eyes
- Wheels
- Windows

Deep Layers Learn:

- Faces
- Dogs
- Cars
- Buildings

This hierarchical learning is possible because receptive fields grow deeper in the network.

---


A CNN recognizes objects because:

$$
\text{Small Features}
\rightarrow
\text{Parts}
\rightarrow
\text{Objects}
$$

and this becomes possible through the continuous growth of the **receptive field** across layers.
