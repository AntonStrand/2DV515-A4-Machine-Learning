'use strict'
const Async = require('crocks/Async')
const Pair = require('crocks/Pair')
const not = require('crocks/logic/not')
const {
  append,
  filter,
  init,
  isEmpty,
  isNil,
  last,
  map,
  pipe,
  reduce,
  split,
  tail
} = require('ramda')
const fs = require('fs')

let categoryIndex = {}
let size = 0

const categoryToInt = category => {
  if (!isNil(categoryIndex[category])) {
    return categoryIndex[category]
  } else {
    categoryIndex[category] = size++
    return categoryIndex[category]
  }
}

/** readFile :: String -> Async Error String */
const readFile = path => Async.fromNode(fs.readFile)(path, 'utf8')

/** lines :: String -> [String] */
const lines = split('\n')

/** columns :: String -> [String] */
const columns = split(',')

/** removeEmptyRows :: [a] -> [a] */
const removeEmptyRows = filter(not(isEmpty))

const convertCSV = pipe(lines, tail, removeEmptyRows, map(columns))

/** readCSV :: String -> [[a]] */
const readCSV = pipe(readFile, map(convertCSV))

/** splitDataAndCategories :: [[a]] -> Pair [[a]] [Number] */
const splitDataAndCategories = reduce(
  (prev, row) =>
    prev.bimap(append(init(row)), append(categoryToInt(last(row)))),
  Pair([], [])
)

readCSV('./datasets/iris.csv')
  .map(splitDataAndCategories)
  .fork(console.error, x => map(console.log, x.fst()))
