---
title:  Numpy 
type: Concept
level: Beginner 
status: 
tags:
  - mathematics 
  - linear algebra
  -  vector
---

## Getting Started

### Introduction

Import NumPy using the common alias `np`:

```python
import numpy as np
```

### Importing & Exporting

|Code|Description|
|---|---|
|`np.loadtxt("file.txt")`|Load data from a text file|
|`np.genfromtxt("file.csv", delimiter=",")`|Load data from a CSV file|
|`np.savetxt("file.txt", arr, delimiter=" ")`|Write an array to a text file|
|`np.savetxt("file.csv", arr, delimiter=",")`|Write an array to a CSV file|

**Example**

```python
arr = np.array([[1, 2], [3, 4]])

np.savetxt("data.csv", arr, delimiter=",")
```

### Creating Arrays

|Code|Description|
|---|---|
|`np.array([1, 2, 3])`|Create a 1D array|
|`np.array([(1, 2, 3), (4, 5, 6)])`|Create a 2D array|
|`np.zeros(3)`|1D array of length 3 filled with `0`|
|`np.ones((3, 4))`|`3 × 4` array filled with `1`|
|`np.eye(5)`|`5 × 5` identity matrix|
|`np.linspace(0, 100, 6)`|6 evenly spaced values from 0 to 100|
|`np.arange(0, 10, 3)`|Values from 0 to less than 10 with step 3|
|`np.full((2, 3), 8)`|`2 × 3` array filled with `8`|
|`np.random.rand(4, 5)`|`4 × 5` array of random floats between 0 and 1|
|`np.random.rand(6, 7) * 100`|`6 × 7` array of random floats between 0 and 100|
|`np.random.randint(5, size=(2, 3))`|`2 × 3` array of random integers from 0 to 4|

**Examples**

```python
# 1D array
arr = np.array([1, 2, 3])

# 2D array
arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

# Zeros
np.zeros(3)

# Ones
np.ones((3, 4))

# Identity matrix
np.eye(5)

# Evenly spaced values
np.linspace(0, 100, 6)

# Range
np.arange(0, 10, 3)
```


### Inspecting Array Properties

|Code|Description|
|---|---|
|`arr.size`|Number of elements in the array|
|`arr.shape`|Dimensions of the array|
|`arr.dtype`|Data type of array elements|
|`arr.astype(dtype)`|Convert elements to another data type|
|`arr.tolist()`|Convert NumPy array to a Python list|
|`np.info(np.eye)`|View documentation for `np.eye`|

**Example**

```python
arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(arr.size)    # 6
print(arr.shape)   # (2, 3)
print(arr.dtype)   # int64 (may vary by system)

arr_float = arr.astype(float)

python_list = arr.tolist()
```

### Copying, Sorting & Reshaping

|Code|Description|
|---|---|
|`np.copy(arr)`|Creates a copy of the array|
|`arr.view()`|Creates a view that shares the same underlying data|
|`arr.sort()`|Sorts the array|
|`arr.sort(axis=0)`|Sorts along a specific axis|
|`arr.flatten()`|Flattens an array into 1D|
|`arr.T`|Transposes the array|
|`arr.reshape(3, 4)`|Reshapes array to `3 × 4`|
|`arr.resize((5, 6))`|Changes the array's shape in-place|

### Important: `copy()` vs `view()`

This distinction is **very important in NumPy**.

```python
arr = np.array([1, 2, 3])

copy_arr = arr.copy()
view_arr = arr.view()
```

- `copy()` → independent data
    
- `view()` → shares the underlying data
    


### Flattening

```python
arr = np.array([
    [1, 2],
    [3, 4]
])

flat = arr.flatten()

print(flat)
# [1 2 3 4]
```

### Transposing

```python
arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])

print(arr.T)
```

Result:

```text
[[1 4]
 [2 5]
 [3 6]]
```

### Reshaping

```python
arr = np.arange(12)

arr = arr.reshape(3, 4)
```

Result:

```text
[[ 0  1  2  3]
 [ 4  5  6  7]
 [ 8  9 10 11]]
```

> **Rule:** The total number of elements must remain the same when using `reshape()`.



## Adding & Removing Elements

|Code|Description|
|---|---|
|`np.append(arr, values)`|Append values to the array|
|`np.insert(arr, 2, values)`|Insert values before index 2|
|`np.delete(arr, 3, axis=0)`|Delete row at index 3|
|`np.delete(arr, 4, axis=1)`|Delete column at index 4|

Example


```python
arr = np.array([1, 2, 3])

arr = np.append(arr, 4)

print(arr)
# [1 2 3 4]
```

### Insert

```python
arr = np.array([1, 2, 4])

arr = np.insert(arr, 2, 3)

print(arr)
# [1 2 3 4]
```


## Combining & Splitting Arrays

|Code|Description|
|---|---|
|`np.concatenate((arr1, arr2), axis=0)`|Concatenate arrays along rows|
|`np.concatenate((arr1, arr2), axis=1)`|Concatenate arrays along columns|
|`np.split(arr, 3)`|Split an array into 3 sub-arrays|
|`np.hsplit(arr, 5)`|Split an array horizontally into 5 parts|

Example

```python
arr1 = np.array([
    [1, 2],
    [3, 4]
])

arr2 = np.array([
    [5, 6],
    [7, 8]
])

result = np.concatenate((arr1, arr2), axis=0)
```

Result:

```text
[[1 2]
 [3 4]
 [5 6]
 [7 8]]
```



## Indexing, Slicing & Subsetting

Indexing is one of the **most important NumPy concepts** for Machine Learning.

|Code|Description|
|---|---|
|`arr[5]`|Get element at index 5|
|`arr[2, 5]`|Get element at row 2, column 5|
|`arr[1] = 4`|Assign `4` to index 1|
|`arr[1, 3] = 10`|Assign `10` to row 1, column 3|
|`arr[0:3]`|Get indices 0, 1, and 2|
|`arr[0:3, 4]`|Get column 4 from rows 0–2|
|`arr[:2]`|Get indices 0 and 1|
|`arr[:, 1]`|Get column 1 from all rows|
|`arr < 5`|Boolean array where values are less than 5|
|`(arr1 < 3) & (arr2 > 5)`|Element-wise boolean condition|
|`~condition`|Invert a boolean condition|
|`arr[arr < 5]`|Select elements smaller than 5|

### 1D Indexing

```python
arr = np.array([10, 20, 30, 40, 50])

print(arr[0])    # 10
print(arr[2])    # 30
```

### 2D Indexing

```python
arr = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])

print(arr[1, 2])
# 6
```

### Slicing

```python
print(arr[0:2])
```

Returns the first two rows.

### Selecting a Column

```python
print(arr[:, 1])
```

Returns:

```text
[2 5 8]
```


## Boolean Indexing

Boolean indexing is extremely important for **data preprocessing and ML**.

```python
arr = np.array([1, 4, 7, 2, 9])

print(arr < 5)
```

Output:

```text
[ True  True False  True False]
```

Select only values less than 5:

```python
print(arr[arr < 5])
```

Output:

```text
[1 4 2]
```

### Multiple Conditions

Use:

- `&` → AND
    
- `|` → OR
    
- `~` → NOT
    

Example:

```python
arr[(arr > 2) & (arr < 8)]
```

> **Important:** With NumPy arrays, use `&` and `|` for element-wise conditions rather than Python's `and` and `or`.



## Vector Math

NumPy performs mathematical operations **element-wise**.

|Code|Description|
|---|---|
|`np.add(arr1, arr2)`|Element-wise addition|
|`np.subtract(arr1, arr2)`|Element-wise subtraction|
|`np.multiply(arr1, arr2)`|Element-wise multiplication|
|`np.divide(arr1, arr2)`|Element-wise division|
|`np.power(arr1, arr2)`|Element-wise exponentiation|
|`np.array_equal(arr1, arr2)`|Check whether arrays have the same shape and elements|
|`np.sqrt(arr)`|Square root of each element|
|`np.sin(arr)`|Sine of each element|
|`np.log(arr)`|Natural logarithm of each element|
|`np.abs(arr)`|Absolute value|
|`np.ceil(arr)`|Round values up|
|`np.floor(arr)`|Round values down|
|`np.round(arr)`|Round values|

### Example

```python
arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])

np.add(arr1, arr2)
# [5 7 9]

np.subtract(arr2, arr1)
# [3 3 3]

np.multiply(arr1, arr2)
# [ 4 10 18]
```

### Operators Are Often Simpler

Instead of:

```python
np.add(arr1, arr2)
```

You can write:

```python
arr1 + arr2
```

Similarly:

```python
arr1 - arr2
arr1 * arr2
arr1 / arr2
arr1 ** arr2
```


## Scalar Math

A scalar is a **single value**.

NumPy automatically applies scalar operations to every element.

|Code|Description|
|---|---|
|`np.add(arr, 1)`|Add 1 to every element|
|`np.subtract(arr, 2)`|Subtract 2 from every element|
|`np.multiply(arr, 3)`|Multiply every element by 3|
|`np.divide(arr, 4)`|Divide every element by 4|
|`np.power(arr, 5)`|Raise every element to the 5th power|

### Example

```python
arr = np.array([1, 2, 3, 4])

print(arr + 10)
```

Output:

```text
[11 12 13 14]
```

This is one of the foundations of **vectorization** in NumPy.



## Statistics

|Code|Description|
|---|---|
|`np.mean(arr, axis=0)`|Mean along a specific axis|
|`arr.sum()`|Sum of all elements|
|`arr.min()`|Minimum value|
|`arr.max(axis=0)`|Maximum along a specific axis|
|`np.var(arr)`|Variance|
|`np.std(arr, axis=1)`|Standard deviation along a specific axis|
|`np.corrcoef(arr)`|Correlation coefficient matrix|

### Example

```python
arr = np.array([1, 2, 3, 4, 5])

print(arr.sum())
# 15

print(arr.min())
# 1

print(arr.max())
# 5

print(np.mean(arr))
# 3.0

print(np.var(arr))
# 2.0

print(np.std(arr))
# 1.414...
```



## Understanding `axis`

`axis` is **extremely important for Machine Learning**.

Consider:

```python
arr = np.array([
    [1, 2, 3],
    [4, 5, 6]
])
```

Shape:

```text
(2, 3)
```

There are:

- 2 rows
    
- 3 columns
    

### `axis=0`

Operate **down the rows**:

```python
np.mean(arr, axis=0)
```

Result:

```text
[2.5 3.5 4.5]
```

### `axis=1`

Operate **across the columns of each row**:

```python
np.mean(arr, axis=1)
```

Result:

```text
[2. 5.]
```

### Mental Model

```text
          columns
        ↓   ↓   ↓

       [1   2   3]
rows → [4   5   6]
```

- `axis=0` → collapse rows → result for each column
    
- `axis=1` → collapse columns → result for each row
    
## Quick Reference

```python
import numpy as np

# Create
np.array([1, 2, 3])
np.zeros((3, 3))
np.ones((3, 3))
np.eye(3)
np.arange(0, 10, 2)
np.linspace(0, 1, 5)

# Properties
arr.shape
arr.size
arr.dtype

# Reshape
arr.reshape(2, 3)
arr.flatten()
arr.T

# Indexing
arr[0]
arr[0, 1]
arr[:, 0]
arr[0:2]

# Boolean filtering
arr[arr > 5]

# Math
arr + 2
arr - 2
arr * 2
arr / 2
arr ** 2

# Statistics
arr.sum()
arr.mean()
arr.min()
arr.max()
np.std(arr)
np.var(arr)

# Combining
np.concatenate((arr1, arr2))

# Sorting
arr.sort()

# Copy
arr.copy()

# Random
np.random.rand(3, 3)
np.random.randint(0, 10, size=(3, 3))
```

