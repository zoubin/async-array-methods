var test = require('tap').test
var map = require('../lib/map')

test('context', function(t) {
  return map([1, 2, 3, 4], function (v) {
    return v << this.num
  }, { num: 2 }).then(function (results) {
    t.same(results, [4, 8, 12, 16])
  })
})

test('empty array', function(t) {
  return map([], function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v << 2)
    })
  }).then(function (results) {
    t.same(results, [])
  })
})

test('sync', function(t) {
  return map([1, 2, 3, 4], function (v) {
    return v << 2
  }).then(function (results) {
    t.same(results, [4, 8, 12, 16])
  })
})

test('async', function(t) {
  return map([1, 2, 3, 4], function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v << 2)
    })
  }).then(function (results) {
    t.same(results, [4, 8, 12, 16])
  })
})

test('promise', function(t) {
  return map([1, 2, 3, 4], function (v) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(v << 2)
      })
    })
  }).then(function (results) {
    t.same(results, [4, 8, 12, 16])
  })
})

test('error', function(t) {
  return map([1, 2.2, 3, 4], function (v, i, a, next) {
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

