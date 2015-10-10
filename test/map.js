var test = require('tape')
var map = require('..').map

test('map', function(t) {
  t.plan(4)
  map(
    [1, 2, 3, 4],
    function (v) {
      return v << 2
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'sync')
    }
  )

  map(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        next(null, v << 2)
      })
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'async')
    }
  )

  map(
    [1, 2, 3, 4],
    function (v) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(v << 2)
        })
      })
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'promise')
    }
  )

  map(
    [1, 2.2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        if (~~v !== v) {
          return next(new Error('not an integer'))
        }
        next(null, v << 2)
      })
    },
    function (err) {
      t.ok(err instanceof Error)
    }
  )

})

