'use strict'
const { readData } = require('./readData')
const { categoryToInt } = require('./readData/categoryToInt')
const NaiveBayes = require('./model/NaiveBayes')

/** matrix :: [a] -> [[ Number ]] */
const matrix = base => base.map(() => Array(base.length).fill(0))

/** confusion_matrix :: ([Number], [Number]) -> [[ Number ]] */
const confusion_matrix = (X, y) => {
  const mtx = matrix([...new Set(y)])

  for (let i = 0; i < X.length; i++) {
    mtx[y[i]][X[i]] = mtx[y[i]][X[i]] + 1
  }
  return mtx
}

readData(categoryToInt())('./datasets/iris.csv').fork(console.error, x => {
  console.time('Iris')
  const irises = new NaiveBayes()
  console.time('Iris - Training time')
  irises.fit(x.fst(), x.snd())
  console.timeEnd('Iris - Training time')
  console.time('Iris - Evaluation time')
  console.table(confusion_matrix(irises.predict(x.fst()), x.snd()))
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
  console.table(confusion_matrix(notes.predict(x.fst()), x.snd()))
  console.timeEnd('Notes - Evaluation time')
  console.timeEnd('Notes')
})
