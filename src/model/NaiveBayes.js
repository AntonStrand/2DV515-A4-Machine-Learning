'use strict'
const { map, mean, pipe, propOr, sum, transpose } = require('ramda')
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
const normalize = ns => ns.map(n => n / sum(ns))

/** getCategory :: [Number] -> Number */
const getCategory = ns => ns.indexOf(Math.max(...ns))

/** pdf :: (Number, Number, Number) -> Number */
const pdf = (x, mean, stdDev) =>
  (1 / (Math.sqrt(2 * Math.PI) * stdDev)) *
  Math.E ** (-((x - mean) ** 2) / (2 * stdDev ** 2))

/** matrix :: [a] -> [[ Number ]] */
const matrix = base => base.map(() => Array(base.length).fill(0))

class NaiveBayes {
  fit (X, y) {
    this._categories = train(X, y)
  }

  predict (X) {
    return X.map(row =>
      this._categories.map(attributes =>
        Math.exp(
          row
            .map((x, i) => pdf(x, attributes[i].mean, attributes[i].stdDev))
            .reduce((sum, x) => sum + Math.log(x), 0)
        )
      )
    ).map(pipe(normalize, getCategory))
  }

  accuracy_score (preds, y) {
    return (
      preds.reduce((sum, pred, i) => (pred === y[i] ? sum + 1 : sum), 0) /
      preds.length
    )
  }

  confusion_matrix (preds, y) {
    const mtx = matrix([...new Set(y)])

    for (let i = 0; i < preds.length; i++) {
      mtx[y[i]][preds[i]] = mtx[y[i]][preds[i]] + 1
    }

    return mtx
  }
}

module.exports = NaiveBayes
