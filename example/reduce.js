var reduce = require('..').reduce

reduce(
  [1, 2, 3, 4],
  function (a, b) {
    return a + b
  },
  function (err, results) {
    console.log('sync:', results)
  }
)

reduce(
  [1, 2, 3, 4],
  function (a, b, i, arr, next) {
    process.nextTick(function () {
      next(null, a + b)
    })
  },
  function (err, results) {
    console.log('async:', results)
  }
)

reduce(
  [1, 2, 3, 4],
  function (a, b) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(a + b)
      })
    })
  },
  function (err, results) {
    console.log('promise:', results)
  }
)

