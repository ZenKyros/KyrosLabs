---
title: "AutoEncoders"
type: Notes
level: Beginner
status:
tags:
  - Deep Learning
  - Generative Models
  - Computer Visionin 
  - Neural Networks
---
## What are AutoEncoders? 
AutoEncoders is a type of neural network designed to effciently compress(encode) input data to its essential features and then decompress(decode) it back to its original form from the compressed representation.

## AutoEncoder vs Encoder/Decoder

| Feature | Autoencoder (Full System) | Encoder | Decoder |
| :--- | :--- | :--- | :--- |
| **Definition** | An **end-to-end neural network** designed to replicate its input to its output through a bottleneck. | A neural network component that **compresses input data** into a lower-dimensional feature representation. | A neural network component that **reconstructs data** from a lower-dimensional representation back into high-dimensional space. |
| **Input** | High-dimensional raw data (e.g., an image, a sentence). | Raw data or tokens from the source domain. | The compressed bottleneck vector (latent space / context vector). |
| **Output** | A reconstructed approximation of the original input. | A dense vector or sequence of hidden states (latent code). | The final reconstructed data or target domain sequence. |
| **Objective / Loss** | **Minimising reconstruction error** (e.g., Mean Squared Error or Binary Cross-Entropy between input and output). | **Information maximization**; retaining the most critical features of the input. | **Generation accuracy**; correctly unfolding the latent vector back into a readable structure. |
| **Standalone Use** | Used as an unsupervised system for **anomaly detection**, data denoising, or pre-training. | Used independently for **feature extraction**, classification, embedding generation, or down-streaming to other models. | Used independently in **generative AI** (like the decoder of a GPT model) to generate new tokens or samples from a prompt/vector. |


## How do AutoEncoders Work?
### Architecture Components
* **Encoder:** Compresses raw input data into a lower-dimensional representation through **dimensionality reduction**. Its hidden layers contain a progressively smaller number of nodes (neurons) to "squeeze" the data.
* **Bottleneck (Code):** The layer containing the most compressed representation of the input. It acts as the output layer for the encoder and the input layer for the decoder. Its size represents the **latent space representation**.
* **Decoder:** Decompresses the data by using hidden layers with a progressively larger number of nodes. It reconstructs the data back to its original form so it can be compared to the ground truth.

### Key Concepts & Mechanics
* **Reconstruction Error:** The mathematical difference between the final decoded output and the original input ("ground truth"). This error is used as the **loss function** to optimize model weights via gradient descent during backpropagation.
* **Post-Training Lifecycle:** The decoder can sometimes be discarded after training if the sole goal is using the encoder for another network. Alternatively, in models like **VAEs**, the decoder is kept to generate brand new data samples.
* **Non-Linear Advantage:** Unlike **Principal Component Analysis (PCA)** which only captures linear relationships, autoencoders use non-linear activation functions (like the sigmoid function) to capture **complex non-linear correlations**.

### Core Hyperparameters to Tune
* **Code Size:** The physical size of the bottleneck. Tuning this value acts as a form of **regularization** to combat overfitting or underfitting.
* **Number of Layers:** Defines the depth of the network. **More depth** equals greater complexity; **less depth** equals faster processing speeds.
* **Nodes Per Layer:** Typically decreases through the encoder and increases through the decoder. The count depends highly on the input scale (e.g., larger images require more neurons).
* **Loss Function:** The metric used to calculate the reconstruction loss between the output and input to drive backpropagation.
