'use strict'
const { map, mean, pipe, propOr, splitEvery, sum, transpose } = require('ramda')
const { standardDeviation } = require('../utils')

/** categorize :: ([[ Number ]], [ Number ]) -> Object */
const categorize = (data, categories) =>
  data.reduce(
    (categorized, row, i) => ({
      ...categorized,
      [categories[i]]: [...propOr([], categories[i], categorized), row]
    }),
    {}
  )

/** summarizeAttribute :: [ Number ] -> { mean :: Number, stdDev :: Number } */
const summarizeAttribute = ns => ({
  mean: mean(ns),
  stdDev: standardDeviation(ns)
})

/** train :: ([[ Number ]], [ Number ]) -> [[ { mean :: Number, stdDev :: Number } ]] */
const train = pipe(
  categorize,
  Object.values,
  map(pipe(transpose, map(summarizeAttribute)))
)

/** normalize :: [Number] -> [Number] */
const normalize = ns => {
  const total = sum(ns)
  return ns.map(n => n / total)
}

/** getCategory :: [Number] -> Number */
const getCategory = ns => ns.indexOf(Math.max(...ns))

/** pdf :: (Number, Number, Number) -> Number */
const pdf = (x, mean, stdDev) =>
  (1 / (Math.sqrt(2 * Math.PI) * stdDev)) *
  Math.E ** (-((x - mean) ** 2) / (2 * stdDev ** 2))

/** matrix :: [a] -> [[ Number ]] */
const matrix = base => base.map(() => Array(base.length).fill(0))

/** chunks :: (Number, [a]) -> [[a]] */
const chunks = (k, xs) => splitEvery(xs.length / k, xs)

class NaiveBayes {
  /**
   * Trains the model on input examples X and labels y
   * @param {Array<Array<Number>>} X Training data
   * @param {Array<Number>} y Correct classifications
   * @returns Void
   */
  fit (X, y) {
    this._categories = train(X, y)
  }

  /**
   * Classifies examples X and returns a list of predictions
   * @param {Array<Array<Number>>} X Data to be classified
   * @returns {Array<Number>} Predictions
   */
  predict (X) {
    return X.map(row =>
      this._categories.map(attributes =>
        Math.exp(
          row.reduce(
            (sum, x, i) =>
              sum + Math.log(pdf(x, attributes[i].mean, attributes[i].stdDev)),
            0
          )
        )
      )
    ).map(pipe(normalize, getCategory))
  }

  /**
   * Calculates accuracy score for a list of predictions
   * @param {Array<Number>} preds
   * @param {Array<Number>} y
   * @returns {Number} Accuracy between 0-1
   */
  accuracy_score (preds, y) {
    return preds.filter((pred, i) => pred === y[i]).length / preds.length
  }

  /**
   * Generates a confusion matrix and returns the result as an integer matrix
   * @param {Array<Number>} preds
   * @param {Array<Number>} y
   * @returns {Array<Array<Number>>} Matrix showing classifications
   */
  confusion_matrix (preds, y) {
    const mtx = matrix([...new Set(y)])

    for (let i = 0; i < preds.length; i++) {
      mtx[y[i]][preds[i]] = mtx[y[i]][preds[i]] + 1
    }

    return mtx
  }

  /**
   * Runs n-fold cross-validation and returns a list of predictions
   * @param {Array<Array<Number>>} X
   * @param {Array<Number>} y
   * @param {Number} folds
   * @returns {Array<Number>} List of predictions
   */
  crossval_predict (X, y, folds) {
    return this._crossTrain(chunks(folds, X), chunks(folds, y), folds)
  }

  _crossTrain ([test, ...trainBuckets], [classification, ...classBuckets], k) {
    if (k === 0) return []
    this.fit(trainBuckets.flat(), classBuckets.flat())
    return [
      this.accuracy_score(this.predict(test), classification),
      ...this._crossTrain(
        [...trainBuckets, test],
        [...classBuckets, classification],
        k - 1
      )
    ]
  }
}

module.exports = NaiveBayes
