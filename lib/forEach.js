var Runner = require('callback-sequence').Runner
var runner = Runner({
  input: false,
  run: { stream: false },
})

module.exports = function (arr, fn, ctx) {
  if (arguments.length < 3) {
    ctx = arr
  }
  return runner.sequence(
    arr.map(function (v, i) {
      return fn.bind(ctx, v, i, arr)
    })
  )
  .then(function () {
    return arr
  })
}

