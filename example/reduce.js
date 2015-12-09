var reduce = require('..').reduce

reduce(
  [1, 2, 3, 4],
  function (a, b) {
    return a + b
  }
)
// 10
.then(console.log.bind(console))

reduce(
  [1, 2, 3, 4],
  function (a, b, i, arr, next) {
    process.nextTick(function () {
      next(null, a + b)
    })
  }
)
// 10
.then(console.log.bind(console))

reduce(
  [1, 2, 3, 4],
  function (a, b) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(a + b)
      })
    })
  }
)
// 10
.then(console.log.bind(console))

