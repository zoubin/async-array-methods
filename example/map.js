var map = require('..').map

var log = console.log.bind(console)

map(
  [1, 2, 3, 4],
  function (v) {
    return v << this.num
  },
  { num: 2 }
)
// [4, 8, 12, 16]
.then(log)

map(
  [1, 2, 3, 4],
  function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v << 2)
    })
  },
  { num: 2 }
)
// [4, 8, 12, 16]
.then(log)

map(
  [1, 2, 3, 4],
  function (v) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(v << 2)
      })
    })
  },
  { num: 2 }
)
// [4, 8, 12, 16]
.then(log)

