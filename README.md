# Machine Learning

My solution for assignment 4 in Web Intelligence (2DV515) at Linnaeus University

## Description

The [assingment](http://coursepress.lnu.se/kurs/web-intelligence/a4/).

- In assignment 4 you shall implement the Naïve Bayes machine learning algorithm and use it on some datasets
- It can be implemented in any programming language you like
- You can work alone or in group of two students
- You shall present your application and code at an oral examination
- Note that you are not required to build a REST web service for this assignment

## Requirements

### Grade E

- [x] Implement the Naïve Bayes algorithm, using the code structure below (you are allowed to add more classes and methods if needed)
- [x] Train the model on the Iris and Banknote authentication datasets (see Datasets page)
- [x] Calculate classification accuracies for both datasets (use all data for both training and testing)

### Grade C-D

- [x] Implement code for generating confusion matrices, using the code structure below

### Grade A-B

- [ ] Implement code for n-fold cross-validation, using the code structure below
- [ ] It shall be possible to use 3, 5 or 10 folds (it is okay if your implementation supports other folds)
- [ ] Calculate accuracy score for 5-fold cross-validation on both datasets

## Code structure requirements

### NaiveBayes class

```java
void fit ( X:float[][], y:int[] )
```

Trains the model on input examples X and labels y.

---

```java
int[] predict ( X:float[][] )
```

Classifies examples X and returns a list of predictions.

---

### Other methods

```java
float accuracy_score ( preds:int[], y:int[] )
```

Calculates accuracy score for a list of predictions.

---

```java
int[][] confusion_matrix ( preds:int[], y:int[] )
```

Generates a confusion matrix and returns the result as an integer matrix.

---

```java
int[] crossval_predict ( X:float[][], y:int[], folds:int )
```

Runs n-fold cross-validation and returns a list of predictions.

---
