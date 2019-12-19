'use strict'

/** isNil :: a -> Boolean */
const isNotNil = x => x != null

/** categoryToInt :: a -> Number */
const categoryToInt = () => {
  let categoryIndex = {}
  let size = 0
  return category => {
    if (isNotNil(categoryIndex[category])) {
      return categoryIndex[category]
    } else {
      categoryIndex[category] = size++
      return categoryIndex[category]
    }
  }
}

module.exports = { categoryToInt }
