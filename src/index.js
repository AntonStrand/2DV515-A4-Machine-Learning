'use strict'
const { readData } = require('./readData')
const { categoryToInt } = require('./readData/categoryToInt')
const NaiveBayes = require('./model/NaiveBayes')
const { mean } = require('ramda')

const toPercent = dec => Math.round(dec * 10000) / 100 + '%'

const runTests = label => data => {
  console.log(`\n##### ${label.toUpperCase()} #####\n`)
  console.time('Total')
  const nb = new NaiveBayes()
  console.time(`Training time`)
  nb.fit(data.fst(), data.snd())
  console.timeEnd(`Training time`)
  console.time(`Evaluation time`)
  const preds = nb.predict(data.fst())
  console.timeEnd(`Evaluation time`)
  console.log('Accuarcy:', toPercent(nb.accuracy_score(preds, data.snd())))
  console.table(nb.confusion_matrix(preds, data.snd()))
  const foldResult = new NaiveBayes().crossval_predict(
    data.fst(),
    data.snd(),
    5
  )
  console.log('5-fold:', foldResult, toPercent(mean(foldResult)))
  console.timeEnd('Total')
}

;['iris', 'banknote'].map(name =>
  readData(categoryToInt())(`./datasets/${name}.csv`).fork(
    console.error,
    runTests(name)
  )
)
