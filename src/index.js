'use strict'
const { readData } = require('./readData')
const { map } = require('ramda')
const { categoryToInt } = require('./readData/categoryToInt')

readData(categoryToInt())('./datasets/iris.csv').fork(console.error, x => {
  // map(console.log, x.fst())
  console.log(x.snd())
})

readData(categoryToInt())('./datasets/banknote.csv').fork(console.error, x => {
  // map(console.log, x.fst())
  console.log(x.snd())
})
