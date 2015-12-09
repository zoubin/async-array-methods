var filter = require('..').filter

filter(
  [1, 2, 3, 4],
  function (v) {
    return v % 2
  }
)
.then(function (res) {
  // [1, 3]
  console.log(res)
})

filter(
  [1, 2, 3, 4],
  function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v % 2)
    })
  }
)
.then(function (res) {
  // [1, 3]
  console.log(res)
})

filter(
  [1, 2, 3, 4],
  function (v) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(v % 2)
      })
    })
  }
)
.then(function (res) {
  // [1, 3]
  console.log(res)
})

