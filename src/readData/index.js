'use strict'
const Async = require('crocks/Async')
const Pair = require('crocks/Pair')
const not = require('crocks/logic/not')
const {
  append,
  filter,
  init,
  isEmpty,
  last,
  map,
  pipe,
  reduce,
  split,
  tail
} = require('ramda')
const fs = require('fs')

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
const splitDataAndCategories = categoryToInt =>
  reduce(
    (prev, row) =>
      prev.bimap(append(init(row)), append(categoryToInt(last(row)))),
    Pair([], [])
  )

/** readData :: (a -> Number) -> String -> Pair [[a]] [Number] */
const readData = categoryToInt =>
  pipe(readCSV, map(splitDataAndCategories(categoryToInt)))

module.exports = { readData }
