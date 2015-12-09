var Runner = require('callback-sequence').Runner
var runner = Runner({
  run: { stream: false },
})

module.exports = function (arr, fn, initial) {
  var len = arr.length

  if (arguments.length < 3) {
    if (len < 1) {
      return Promise.reject(new Error('Reduce of empty array with no initial value'))
    }
    if (len === 1) {
      return Promise.resolve(arr[0])
    }
    initial = arr[0]
    arr = arr.slice(1)
  }

  if (!arr.length) {
    return Promise.resolve(initial)
  }

  return runner.sequence(
    arr.map(function (v, i) {
      if (fn.length < 5) {
        return function (o) {
          return fn.call(arr, o, v, i, arr)
        }
      }
      return function (o, next) {
        return fn.call(arr, o, v, i, arr, next)
      }
    }),
    [initial]
  )
  .then(function (res) {
    return res[0]
  })
}

