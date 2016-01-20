# async-array-methods
[![version](https://img.shields.io/npm/v/async-array-methods.svg)](https://www.npmjs.org/package/async-array-methods)
[![status](https://travis-ci.org/zoubin/async-array-methods.svg?branch=master)](https://travis-ci.org/zoubin/async-array-methods)
[![coverage](https://img.shields.io/coveralls/zoubin/async-array-methods.svg)](https://coveralls.io/github/zoubin/async-array-methods)
[![dependencies](https://david-dm.org/zoubin/async-array-methods.svg)](https://david-dm.org/zoubin/async-array-methods)
[![devDependencies](https://david-dm.org/zoubin/async-array-methods/dev-status.svg)](https://david-dm.org/zoubin/async-array-methods#info=devDependencies)

Async methods to manipulate arrays.

## Usage

```javascript
var methods = require('async-array-methods')
var AsyncArray = methods.Array
var filter = methods.filter
var map = methods.map
var forEach = methods.forEach
var reduce = methods.reduce

```

All methods return a promise.

- [filter](#filter)
- [map](#map)
- [series](#series)
- [forEach](#foreach)
- [reduce](#reduce)
- [AsyncArray](#asyncarray)

## Methods

Callbacks can be made asynchronous
by returning a promise, or
accepting a function argument,
which will be called when the callback finishes.

Otherwise, the callback is treated as synchronous.

### filter

Signature: `filter(arr, fn, context)`

```javascript
filter(
  [1, 2, 3, 4],
  function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v % 2)
    })
  }
)
.then(function (res) {
  // [1, 3]
  console.log(res)
})

```

### map

Signature: `map(arr, fn, context)`

`fn` is called with each element in parallel.

```javascript
map(
  [1, 2, 3, 4],
  function (v) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(v << 2)
      })
    })
  },
  { num: 2 }
)
// [4, 8, 12, 16]
.then(console.log.bind(console))

```

### series
This method works like `map`,
except that `fn` is called with each element in sequence rather than in parallel.

Signature: `series(arr, fn, context)`


```javascript
var n = 1
series(
  [1, 2, 3, 4],
  function (v, i, arr, next) {
    var delay = rand()
    console.log('i:', i, 'delay:', delay)
    setTimeout(function() {
      next(null, v << n++)
    }, delay)
  }
)
// i: 0 delay: 10
// i: 1 delay: 50
// i: 2 delay: 0
// i: 3 delay: 80
// [2, 8, 24, 64]
.then(log)

function rand() {
  return Math.floor(Math.random() * 10) * 10
}

```

### forEach

`fn` is called with elements in sequence.

Signature: `forEach(arr, fn, context)`

```javascript
var count = 0

forEach(
  [1, 2, 3, 4],
  function (v, i, _, next) {
    process.nextTick(function () {
      console.log(count++, i)
      next(null, v << 2)
    })
  }
)
.then(function (arr) {
  // [1, 2, 3, 4]
  console.log(arr)
})

```

### reduce

Signature: `reduce(arr, fn, initial)`

```javascript
reduce(
  [1, 2, 3, 4],
  function (a, b, i, arr, next) {
    process.nextTick(function () {
      next(null, a + b)
    })
  }
)
// 10
.then(console.log.bind(console))

```

### AsyncArray
Signature: `AsyncArray(arr)`

Methods:
* `map`
* `series`
* `filter`
* `forEach`
* `reduce`

```javascript
var origin = AsyncArray([1, 2, 3, 4, 5, 6])
var odd = origin.filter(isOdd)
var even = origin.filter(isEven)

return odd.then(function (res) {
  // [1, 3, 5]
  console.log(res)
  return even
})
.then(function (res) {
  // [2, 4, 6]
  console.log(res)
})
.then(function () {
  return even.reduce(flagMap, {})
})
.then(function (res) {
  // { 2: true, 4: true, 6: true }
  console.log(res)
})
.then(function () {
  // chain
  return origin.filter(isOdd).reduce(flagMap, {})
})
.then(function (res) {
  // { 1: true, 3: true, 5: true }
  console.log(res)
})

function isOdd(n, i, arr, next) {
  process.nextTick(function () {
    next(null, n % 2)
  })
}

function isEven(n, i, arr, next) {
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

```

