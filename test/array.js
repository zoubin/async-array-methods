var test = require('tap').test
var AsyncArray = require('../lib/async-array')

test('filter', function(t) {
  var origin = AsyncArray([1, 2, 3, 4, 5, 6])
  return origin.filter(isOdd)
    .then(function (res) {
      t.same(res, [1, 3, 5], 'async')
    })
})

test('map', function(t) {
  var origin = AsyncArray([1, 3, 5])
  return origin.map(function (v) {
    return Promise.resolve()
      .then(function () {
        return v + 1
      })
  })
  .then(function (res) {
    t.same(res, [2, 4, 6], 'promise')
  })
})

test('series', function(t) {
  var origin = AsyncArray([1, 3, 5])
  var delays = [10, 0, 20]
  return origin.series(function (v, i, arr, next) {
    setTimeout(function() {
      next(null, v + 1)
    }, delays[i])
  })
  .then(function (res) {
    t.same(res, [2, 4, 6])
  })

})

test('reduce', function(t) {
  var origin = AsyncArray([1, 3, 5])
  return origin.reduce(function (a, b) {
    return a + b
  })
  .then(function (res) {
    t.same(res, 9, 'sync')
  })
})

test('forEach', function(t) {
  t.plan(2)

  var arr = AsyncArray([1, 3, 5])

  arr.forEach(function (v, i, o) {
    o[i] = v + 2
  }).then(function (res) {
    t.same(res, [3, 5, 7])
    return arr
  }).then(function (res) {
    t.same(res, [3, 5, 7])
  })
})

test('chain', function(t) {
  t.plan(4)

  var origin = AsyncArray([1, 2, 3, 4, 5, 6])
  var odd = origin.filter(isOdd)
  var even = origin.filter(isEven)
  var flag = origin.filter(isOdd).reduce(flagMap, {})

  odd.then(function (res) {
    t.same(res, [1, 3, 5])
  })

  even.then(function (res) {
    t.same(res, [2, 4, 6])
  })

  flag.then(function (res) {
    t.same(res, { 1: true, 3: true, 5: true })
  })

  even.reduce(flagMap, {}).then(function (res) {
    t.same(res, { 2: true, 4: true, 6: true })
  })
})

test('error', function(t) {
  t.plan(1)
  AsyncArray(['a', 1, 'b']).map(function (v) {
    return v.toUpperCase()
  })
  .catch(function (err) {
    t.ok(err instanceof Error)
  })
})

function isOdd(n, i, arr, next) {
  process.nextTick(function () {
    next(null, n % 2)
  })
}

function isEven(n) {
  return new Promise(function (resolve) {
    process.nextTick(function () {
      resolve((n + 1) % 2)
    })
  })
}

function flagMap(o, v) {
  o[v] = true
  return o
}

