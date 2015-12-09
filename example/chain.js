var AsyncArray = require('..').Array

Promise.resolve()
.then(function () {
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
})
.then(function () {

  // Modify the original array
  var origin = [1, 3, 5]
  var arr = AsyncArray(origin)
  arr.forEach(function (v, i, arr) {
    arr[i] = v + 2
  })
  .then(function (res) {
    // [3, 5, 7]
    console.log(res)
    return arr
  })
  .then(function (res) {
    // [3, 5, 7]
    console.log(res)
  })
  .then(function () {
    // [3, 5, 7]
    console.log(origin)
  })

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

