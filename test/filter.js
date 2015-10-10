var test = require('tape')
var filter = require('..').filter

test('filter', function(t) {
  t.plan(3)
  filter(
    [1, 2, 3, 4],
    function (v) {
      return v % 2
    },
    function (err, results) {
      t.same(results, [1, 3], 'sync')
    }
  )

  filter(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        next(null, v % 2)
      })
    },
    function (err, results) {
      t.same(results, [1, 3], 'async')
    }
  )

  filter(
    [1, 2, 3, 4],
    function (v) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(v % 2)
        })
      })
    },
    function (err, results) {
      t.same(results, [1, 3], 'promise')
    }
  )

})

