var test = require('tap').test
var reduce = require('../lib/reduce')

test('sync', function(t) {
  return reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return a + b
    }
  )
  .then(function (results) {
    t.equal(results, 10, 'sync')
  })
})

test('async', function(t) {
  return reduce(
    [1, 2, 3, 4],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next(null, a + b)
      })
    },
    10
  )
  .then(function (results) {
    t.equal(results, 20, 'async')
  })
})

test('promise', function(t) {
  return reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(a + b)
        })
      })
    },
    10
  )
  .then(function (results) {
    t.equal(results, 20, 'promise')
  })
})

test('invalid input', function(t) {
  return reduce(
    [],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next(null, a + b)
      })
    }
  )
  .catch(function (e) {
    t.ok(e instanceof Error)
  })
})

test('single element, no initial', function(t) {
  return reduce(
    [1],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next([a, b])
      })
    }
  )
  .then(function (res) {
    t.same(res, 1)
  })
})

test('empty', function(t) {
  return reduce(
    [],
    function (a, b) {
      return a + b
    },
    1
  )
  .then(function (results) {
    t.equal(results, 1)
  })
})

test('error', function(t) {
  return reduce(
    [1, 2, 3, 4],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next([a, b])
      })
    },
    10
  )
  .catch(function (err) {
    t.same(err, [10, 1])
  })
})

