---
title: EffcientNet
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - CNN
  - Computer Visionin 
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



## Core Ideas

EfficientNet is mainly built around:

```text
EfficientNet
    │
    ├── Efficient building blocks
    │      ├── MBConv (Mobile Inverted Bottleneck Convolution)
    │      ├── Depthwise Convolution
    │      └── Squeeze-and-Excitation
    │
    └── Compound Scaling
           ├── Depth
           ├── Width
           └── Resolution
```




## EfficientNet-B0

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


## EfficientNet-B0 Architecture

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



### 1. Depthwise Separable Convolution

EfficientNet uses **depthwise separable convolutions** inside its MBConv blocks.

A standard convolution performs spatial and channel mixing together.

Depthwise separable convolution separates this into two operations:

```text
Depthwise Convolution
        ↓
Pointwise Convolution
```

#### Depthwise Convolution

A separate spatial filter is applied to each input channel.

For example:

```text
Input:
64 channels

Depthwise Conv:
64 filters

Each filter processes one channel
```

#### Pointwise Convolution

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



### 2. MBConv

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

## Expansion

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



## Depthwise Convolution

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


## Squeeze-and-Excitation (SE)

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


## Projection

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

-

## Why is it called "Inverted Residual"?

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



## Skip Connection in MBConv

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



## 3. Compound Scaling

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


## Why Not Scale Only One?

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



## Compound Scaling Formula

The relationship is mathematically defined as:

$$d = \alpha^\phi$$
$$w = \beta^\phi$$
$$r = \gamma^\phi$$

$$\text{subject to: } \alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$$
$$\alpha \ge 1, \beta \ge 1, \gamma \ge 1$$

### Parameter Breakdown
* **$\phi$ (Compound Coefficient):** A user-controlled multiplier that dictates how many total computational resources are available to the network.
* **$\alpha$ (Depth Factor):** Determines how many layers to add to the network.
* **$\beta$ (Width Factor):** Dictates how many channels to add to the convolutional layers.
* **$\gamma$ (Resolution Factor):** Sets the height and width of the input image.

### Why the Constraints Exist
* **FLOP Scaling:** Doubling the network depth ($d$) doubles the floating-point operations (FLOPs). However, doubling the width ($w$) or resolution ($r$) increases FLOPs by **four times** ($2^2$) because they affect two dimensions simultaneously (width/height or input/output channels).
* **The Constant 2:** By constraining $\alpha \cdot \beta^2 \cdot \gamma^2 \approx 2$, scaling the overall network by any compound coefficient $\phi$ will scale the total FLOPs by roughly $2^\phi$. 

The scaling factors are chosen so that the model grows in a balanced way.

The key idea is **not the exact formula**.

The important idea is:

> **Increase depth, width, and resolution together instead of increasing only one dimension.**



## EfficientNet Family

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


## EfficientNet-Lite

EfficientNet-Lite is a family designed for more resource-constrained environments such as:

* Mobile devices
* Edge devices
* On-device inference

The main goal is efficient deployment with limited computational resources.


## EfficientNet vs ResNet

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



## EfficientNet Mental Model

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

## Implementation
```python
import torch
import torch.nn as nn
import math
from typing import List

# ============================================
# Utility Functions
# ============================================

def _make_divisible(v: float, divisor: int = 8, min_value: int = None) -> int:
    """Ensures channel dimensions are multiples of `divisor` for hardware efficiency."""
    if min_value is None:
        min_value = divisor
    new_v = max(min_value, int(v + divisor / 2) // divisor * divisor)
    # Make sure that round down does not go down by more than 10%.
    if new_v < 0.9 * v:
        new_v += divisor
    return new_v


# ============================================
# MBConv Block (Mobile Inverted Bottleneck)
# ============================================

class MBConvBlock(nn.Module):
    """
    Mobile Inverted Bottleneck Block with Squeeze-and-Excitation
    """
    def __init__(
        self,
        in_channels: int,
        out_channels: int,
        kernel_size: int,
        stride: int,
        expand_ratio: int,
        se_ratio: float = 0.25,
        drop_rate: float = 0.0
    ):
        super().__init__()
        
        self.drop_rate = drop_rate
        self.use_residual = (stride == 1 and in_channels == out_channels)
        expanded_channels = in_channels * expand_ratio
        
        # 1. Expansion Phase (1x1 Conv)
        if expand_ratio != 1:
            self.expand_conv = nn.Sequential(
                nn.Conv2d(in_channels, expanded_channels, 1, bias=False),
                nn.BatchNorm2d(expanded_channels),
                nn.SiLU(inplace=True)
            )
        else:
            self.expand_conv = nn.Identity()
        
        # 2. Depthwise Conv Phase (KxK Conv)
        padding = (kernel_size - 1) // 2
        self.depthwise_conv = nn.Sequential(
            nn.Conv2d(
                expanded_channels, expanded_channels, kernel_size, stride, 
                padding, groups=expanded_channels, bias=False
            ),
            nn.BatchNorm2d(expanded_channels),
            nn.SiLU(inplace=True)
        )
        
        # 3. Squeeze-and-Excitation Phase
        # FIX: SE reduction should be based on expanded_channels, not in_channels
        se_channels = max(1, int(expanded_channels * se_ratio))
        self.se = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Conv2d(expanded_channels, se_channels, 1),
            nn.SiLU(inplace=True),
            nn.Conv2d(se_channels, expanded_channels, 1),
            nn.Sigmoid()
        )
        
        # 4. Projection Phase (1x1 Conv, Linear)
        self.project_conv = nn.Sequential(
            nn.Conv2d(expanded_channels, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels)
        )
        
    def forward(self, x):
        residual = x
        
        x = self.expand_conv(x)
        x = self.depthwise_conv(x)
        
        # Apply SE weights
        x = x * self.se(x)
        
        x = self.project_conv(x)
        
        # Skip connection with stochastic depth
        if self.use_residual:
            if self.training and self.drop_rate > 0:
                x = self._stochastic_depth(x, self.drop_rate)
            x = x + residual
            
        return x
    
    def _stochastic_depth(self, x: torch.Tensor, drop_rate: float) -> torch.Tensor:
        """Applies stochastic depth (DropPath) regularization."""
        keep_prob = 1.0 - drop_rate
        # Shape: (batch_size, 1, 1, 1) for broadcasting across channels/spatial dims
        mask = torch.empty((x.size(0), 1, 1, 1), device=x.device, dtype=x.dtype)
        mask = mask.bernoulli_(keep_prob)
        return x / keep_prob * mask


# ============================================
# EfficientNet Architecture
# ============================================

class EfficientNet(nn.Module):
    def __init__(
        self,
        width_coeff: float = 1.0,
        depth_coeff: float = 1.0,
        dropout_rate: float = 0.2,
        num_classes: int = 1000,
        drop_path_rate: float = 0.2  # Max drop rate for stochastic depth
    ):
        super().__init__()
        
        # Base configuration: [kernel_size, out_channels, num_layers, stride, expand_ratio]
        base_config = [
            [3, 16, 1, 1, 1],
            [3, 24, 2, 2, 6],
            [5, 40, 2, 2, 6],
            [3, 80, 3, 2, 6],
            [5, 112, 3, 1, 6],
            [5, 192, 4, 2, 6],
            [3, 320, 1, 1, 6],
        ]
        
        # Scale the config
        self.config = self._scale_config(base_config, width_coeff, depth_coeff)
        
        # Stem
        stem_channels = _make_divisible(32 * width_coeff)
        self.stem = nn.Sequential(
            nn.Conv2d(3, stem_channels, 3, 2, 1, bias=False),
            nn.BatchNorm2d(stem_channels),
            nn.SiLU(inplace=True)
        )
        
        # Build blocks
        self.blocks = nn.ModuleList()
        in_channels = stem_channels
        
        # FIX: Calculate total blocks to linearly scale drop_path_rate
        total_blocks = sum([layers for _, _, layers, _, _ in self.config])
        block_idx = 0
        
        for kernel, out_channels, num_layers, stride, expand_ratio in self.config:
            for i in range(num_layers):
                block_stride = stride if i == 0 else 1
                
                # FIX: Linearly increase drop rate from 0 to drop_path_rate
                current_drop_rate = drop_path_rate * (block_idx / total_blocks)
                
                block = MBConvBlock(
                    in_channels=in_channels,
                    out_channels=out_channels,
                    kernel_size=kernel,
                    stride=block_stride,
                    expand_ratio=expand_ratio,
                    se_ratio=0.25,
                    drop_rate=current_drop_rate
                )
                self.blocks.append(block)
                in_channels = out_channels
                block_idx += 1
        
        # Head
        head_channels = _make_divisible(1280 * width_coeff)
        self.head = nn.Sequential(
            nn.Conv2d(in_channels, head_channels, 1, bias=False),
            nn.BatchNorm2d(head_channels),
            nn.SiLU(inplace=True)
        )
        
        # Classifier
        self.avgpool = nn.AdaptiveAvgPool2d(1)
        self.dropout = nn.Dropout(dropout_rate)
        self.fc = nn.Linear(head_channels, num_classes)
        
        # Initialize weights
        self._initialize_weights()
    
    def _scale_config(self, base_config: List[List], width_coeff: float, depth_coeff: float) -> List[List]:
        """Scale the configuration based on compound scaling coefficients."""
        scaled_config = []
        for kernel, channels, layers, stride, expand_ratio in base_config:
            # FIX: Apply _make_divisible to scaled channels
            scaled_channels = _make_divisible(channels * width_coeff)
            scaled_layers = int(math.ceil(layers * depth_coeff))
            scaled_config.append([kernel, scaled_channels, scaled_layers, stride, expand_ratio])
        return scaled_config
    
    def _initialize_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
            elif isinstance(m, nn.Linear):
                nn.init.normal_(m.weight, 0, 0.01)
                nn.init.constant_(m.bias, 0)
    
    def forward(self, x):
        x = self.stem(x)
        for block in self.blocks:
            x = block(x)
        x = self.head(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)  # Modern alternative to x.view(x.size(0), -1)
        x = self.dropout(x)
        x = self.fc(x)
        return x


# ============================================
# EfficientNet Variants (B0 - B7)
# ============================================
# Note: `resolution_coeff` is kept for API completeness, but input 
# tensor resizing must be handled by the user/data pipeline.

def efficientnet_b0(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.0, depth_coeff=1.0, dropout_rate=0.2, num_classes=num_classes)

def efficientnet_b1(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.0, depth_coeff=1.1, dropout_rate=0.2, num_classes=num_classes)

def efficientnet_b2(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.1, depth_coeff=1.2, dropout_rate=0.3, num_classes=num_classes)

def efficientnet_b3(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.2, depth_coeff=1.4, dropout_rate=0.3, num_classes=num_classes)

def efficientnet_b4(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.4, depth_coeff=1.8, dropout_rate=0.4, num_classes=num_classes)

def efficientnet_b5(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.6, depth_coeff=2.2, dropout_rate=0.4, num_classes=num_classes)

def efficientnet_b6(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=1.8, depth_coeff=2.6, dropout_rate=0.5, num_classes=num_classes)

def efficientnet_b7(num_classes: int = 1000) -> EfficientNet:
    return EfficientNet(width_coeff=2.0, depth_coeff=3.1, dropout_rate=0.5, num_classes=num_classes)


# ============================================
# Usage Example & Verification
# ============================================

if __name__ == "__main__":
    # Create model
    model = efficientnet_b0(num_classes=1000)
    model.eval() # Set to eval mode to disable dropout/stochastic depth for testing
    
    # Print model summary
    total_params = sum(p.numel() for p in model.parameters())
    print(f"Model: EfficientNet-B0")
    print(f"Total parameters: {total_params:,} (~{total_params/1e6:.2f}M)")
    
    # Forward pass (B0 expects 224x224)
    x = torch.randn(2, 3, 224, 224)
    with torch.no_grad():
        output = model(x)
        
    print(f"Input shape:  {x.shape}")
    print(f"Output shape: {output.shape}")
    

```