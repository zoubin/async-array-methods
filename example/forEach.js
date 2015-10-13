var forEach = require('..').forEach

var count = 0

forEach(
  [1, 2, 3, 4],
  function (v, i, _, next) {
    process.nextTick(function () {
      console.log(count++ === i)
      next(null, v << 2)
    })
  },
  function (err, results) {
    console.log(results)
  }
)

