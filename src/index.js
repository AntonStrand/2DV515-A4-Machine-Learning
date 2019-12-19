'use strict'
const { readData } = require('./readData')
const { categoryToInt } = require('./readData/categoryToInt')

const { map, mean, pipe, propOr, transpose } = require('ramda')

/** categorize :: ([[ Number ]], [ Number ]) -> Object */
const categorize = (data, categories) =>
  data.reduce(
    (categorized, row, i) => ({
      ...categorized,
      [categories[i]]: [...propOr([], categories[i], categorized), row]
    }),
    {}
  )

/** standardDeviation :: [ Number ] -> Number */
const standardDeviation = ns => {
  const m = mean(ns)
  return Math.sqrt(
    ns.reduce((sum, n) => sum + (n - m) * (n - m), 0) / ns.length
  )
}

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

readData(categoryToInt())('./datasets/iris.csv').fork(console.error, x => {
  // map(console.log, x.fst())
  console.log(train(x.fst(), x.snd()))
})

// readData(categoryToInt())('./datasets/banknote.csv').fork(console.error, x => {
//   // map(console.log, x.fst())
//   console.log(x.snd())
// })
