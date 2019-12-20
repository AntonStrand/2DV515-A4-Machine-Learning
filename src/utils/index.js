'use strict'
const { mean } = require('ramda')

/** standardDeviation :: [ Number ] -> Number */
const standardDeviation = ns => {
  const m = mean(ns)
  const N = ns.length
  return Math.sqrt(ns.reduce((sum, n) => sum + (n - m) ** 2, 0) / (N - 1))
}

module.exports = {
  standardDeviation
}
