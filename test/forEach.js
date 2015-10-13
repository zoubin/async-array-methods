var test = require('tape')
var each = require('..').forEach

test('forEach', function(t, cb) {
  var count = 0
  each(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        t.equal(count++, i)
        next(null, v << 2)
      })
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16])
      cb()
    }
  )

})

test('forEach, err', function(t) {
  t.plan(1)
  each(
    ['1', 2, '3', 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        try {
          var code = v.charCodeAt(0)
        } catch (e) {
          return next(e)
        }
        next(null, code)
      })
    },
    function (err) {
      t.ok(err instanceof Error)
    }
  )

})

