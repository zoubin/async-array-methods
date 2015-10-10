var methods = require('..')
var chain = methods.chain

chain(
  [1, 2, 3, 4],
  [
    function (res) {
      return res.map(function (r) {
        return ++r
      })
    },
    [methods, 'filter', odd],
    function (res, next) {
      process.nextTick(function () {
        next(null, res.map(function (r) {
          return ++r
        }))
      })
    },
    [methods, 'map', plusplus],
    function (res) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(res.map(function (r) {
            return ++r
          }))
        })
      })
    },
    [methods, 'reduce', sum, 10],
  ],
  function (err, res) {
    console.log(err, res)
  }
)

function odd(v) {
  return v % 2
}

function plusplus(v, i, a, next) {
  process.nextTick(function () {
    next(null, ++v)
  })
}

function sum(a, b) {
  return new Promise(function (rs) {
    process.nextTick(function () {
      rs(a + b)
    })
  })
}

