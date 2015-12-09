var test = require('tap').test
var each = require('../lib/forEach')

test('context, sync', function(t) {
  var results = []
  return each([1, 2, 3, 4], function (v) {
    return results.push(v << this.num)
  }, { num: 2 }).then(function () {
    t.same(results, [4, 8, 12, 16])
  })
})

test('empty', function(t) {
  var results = []
  return each([], function (v) {
    return results.push(v << 2)
  }).then(function () {
    t.same(results, [])
  })
})

test('async', function(t) {
  var count = 0
  var results = []
  return each(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        results.push(count++)
        next()
      })
    }
  )
  .then(function () {
    t.same(results, [0, 1, 2, 3])
  })
})

test('promise', function(t) {
  var results = []
  return each(
    [1, 2, 3, 4],
    function (v) {
      return new Promise(function (resolve) {
        process.nextTick(function () {
          results.push(v - 1)
          resolve()
        })
      })
    }
  )
  .then(function () {
    t.same(results, [0, 1, 2, 3])
  })
})

test('error', function(t) {
  t.plan(1)
  each(['1', 2, '3', 4], function (v, i, a, next) {
    process.nextTick(function () {
      try {
        var code = v.charCodeAt(0)
      } catch (e) {
        return next(e)
      }
      next(null, code)
    })
  }).catch(function (err) {
    t.ok(err instanceof Error)
  })
})

test('result', function(t) {
  return each(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(next)
    }
  )
  .then(function (res) {
    t.same(res, [1, 2, 3, 4])
  })
})

