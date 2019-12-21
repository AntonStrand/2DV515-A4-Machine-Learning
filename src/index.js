'use strict'
const { readData } = require('./readData')
const { categoryToInt } = require('./readData/categoryToInt')
const NaiveBayes = require('./model/NaiveBayes')

readData(categoryToInt())('./datasets/iris.csv').fork(console.error, x => {
  console.time('Iris')
  const irises = new NaiveBayes()
  console.time('Iris - Training time')
  irises.fit(x.fst(), x.snd())
  console.timeEnd('Iris - Training time')
  console.time('Iris - Evaluation time')
  const preds = irises.predict(x.fst())
  console.log(
    Math.round(irises.accuracy_score(preds, x.snd()) * 10000) / 100 + '%'
  )
  console.table(irises.confusion_matrix(preds, x.snd()))
  console.timeEnd('Iris - Evaluation time')
  console.timeEnd('Iris')
})

readData(categoryToInt())('./datasets/banknote.csv').fork(console.error, x => {
  console.time('Notes')
  const notes = new NaiveBayes()
  console.time('Notes - Training time')
  notes.fit(x.fst(), x.snd())
  console.timeEnd('Notes - Training time')
  console.time('Notes - Evaluation time')
  const preds = notes.predict(x.fst())
  console.log(
    Math.round(notes.accuracy_score(preds, x.snd()) * 10000) / 100 + '%'
  )
  console.table(notes.confusion_matrix(preds, x.snd()))
  console.timeEnd('Notes - Evaluation time')
  console.timeEnd('Notes')
})
