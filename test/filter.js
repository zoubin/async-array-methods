var test = require('tap').test
var filter = require('../lib/filter')

test('context', function(t) {
  return filter(
    [1, 2, 3, 4],
    function (v) {
      return v % this.num
    },
    { num: 2 }
  )
  .then(function (results) {
    t.same(results, [1, 3])
  })
})

test('sync', function(t) {
  return filter(
    [1, 2, 3, 4],
    function (v) {
      return v % 2
    }
  )
  .then(function (results) {
    t.same(results, [1, 3])
  })
})

test('async', function(t) {
  return filter(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        next(null, v % 2)
      })
    }
  )
  .then(function (results) {
    t.same(results, [1, 3])
  })
})

test('promise', function(t) {
  return filter(
    [1, 2, 3, 4],
    function (v) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(v % 2)
        })
      })
    }
  )
  .then(function (results) {
    t.same(results, [1, 3])
  })
})

test('error', function(t) {
  return filter([1, 2.2, 3, 4], function (v, i, a, next) {
    process.nextTick(function () {
      if (~~v !== v) {
        return next(new Error('not an integer'))
      }
      next(null, v << 2)
    })
  }).catch(function (err) {
    t.ok(err instanceof Error)
  })
})

