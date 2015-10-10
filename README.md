# async-array-methods
Async methods to operate on collections.

[![npm](https://nodei.co/npm/async-array-methods.png?downloads=true)](https://www.npmjs.org/package/async-array-methods)

[![version](https://img.shields.io/npm/v/async-array-methods.svg)](https://www.npmjs.org/package/async-array-methods)
[![status](https://travis-ci.org/zoubin/async-array-methods.svg?branch=master)](https://travis-ci.org/zoubin/async-array-methods)
[![dependencies](https://david-dm.org/zoubin/async-array-methods.svg)](https://david-dm.org/zoubin/async-array-methods)
[![devDependencies](https://david-dm.org/zoubin/async-array-methods/dev-status.svg)](https://david-dm.org/zoubin/async-array-methods#info=devDependencies)

## Usage

Methods:

- [filter](#filter)
- [map](#map)
- [reduce](#reduce)
- [chain](#chain)

## Callbacks

Callbacks can be made asynchronous by returning a promise,
or appending a function argument,
which will be called when the callback finishes.

Otherwise, the callback is treated as synchronous.

## filter

Signature: `filter(arr, fn, done)`

```javascript
filter(
  [1, 2, 3, 4],
  function (v) {
    return new Promise(function (rs) {
      process.nextTick(function () {
        rs(v % 2);
      });
    });
  },
  function (err, results) {
    console.log('promise:', results);
  }
);
```

## map

Signature: `map(arr, fn, done)`

```javascript
map(
  [1, 2, 3, 4],
  function (v, i, a, next) {
    process.nextTick(function () {
      next(null, v << 2);
    });
  },
  function (err, results) {
    console.log('async:', results);
  }
);

```

## reduce

Signature: `reduce(arr, fn, initial, done)`

```javascript
reduce(
  [1, 2, 3, 4],
  function (a, b, i, arr, next) {
    process.nextTick(function () {
      next(null, a + b);
    });
  },
  function (err, results) {
    console.log('async:', results);
  }
);

```

## chain

Signature: `chain(arr, callbacks, done)`

```javascript
var methods = require('async-array-methods')
methods.chain(
  [1, 2, 3, 4],
  [
    function (res) {
      return res.map(function (r) {
        return ++r
      })
    },
    [methods, 'filter', odd],
    function (res, next) {
      process.nextTick(function () {
        next(null, res.map(function (r) {
          return ++r
        }))
      })
    },
    [methods, 'map', plusplus],
    function (res) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(res.map(function (r) {
            return ++r
          }))
        })
      })
    },
    [methods, 'reduce', sum, 10],
  ],
  function (err, res) {
    console.log(err, res)
  }
)

function odd(v) {
  return v % 2;
}

function plusplus(v, i, a, next) {
  process.nextTick(function () {
    next(null, ++v);
  });
}

function sum(a, b) {
  return new Promise(function (rs) {
    process.nextTick(function () {
      rs(a + b);
    });
  });
}

```

