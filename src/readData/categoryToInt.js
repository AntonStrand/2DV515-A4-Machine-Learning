'use strict'
let categoryIndex = {}
let size = 0

/** isNil :: a -> Boolean */
const isNotNil = x => x != null

/** categoryToInt :: a -> Number */
const categoryToInt = category => {
  if (isNotNil(categoryIndex[category])) {
    return categoryIndex[category]
  } else {
    categoryIndex[category] = size++
    return categoryIndex[category]
  }
}

module.exports = { categoryToInt }
