'use strict'
const { readData } = require('./readData')
const { map } = require('ramda')

readData('./datasets/iris.csv').fork(console.error, x => {
  map(console.log, x.fst())
  map(console.log, x.snd())
})
