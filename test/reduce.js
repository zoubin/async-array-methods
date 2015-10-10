var test = require('tape')
var reduce = require('..').reduce

test('reduce, sync', function(t) {
  t.plan(1)
  reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return a + b
    },
    function (err, results) {
      t.equal(results, 10, 'sync')
    }
  )
})

test('reduce, async', function(t) {
  t.plan(1)

  reduce(
    [1, 2, 3, 4],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next(null, a + b)
      })
    },
    10,
    function (err, results) {
      t.equal(results, 20, 'async')
    }
  )
})

test('reduce, error', function(t) {
  t.plan(2)

  try {
    reduce(
      [],
      function (a, b, i, arr, next) {
        process.nextTick(function () {
          next(null, a + b)
        })
      }
    )
  } catch (e) {
    t.ok(true)
  }

  reduce(
    [1, 2, 3, 4],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next([a, b])
      })
    },
    10,
    function (err) {
      t.same(err, [10, 1])
    }
  )
})

test('reduce, promise', function(t) {
  t.plan(1)

  reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(a + b)
        })
      })
    },
    10,
    function (err, results) {
      t.equal(results, 20, 'promise')
    }
  )

})

