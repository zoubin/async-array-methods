var Runner = require('callback-sequence').Runner
var runner = Runner({
  run: { stream: false },
})

module.exports = function (arr, fn, ctx) {
  if (arguments.length < 3) {
    ctx = arr
  }

  return runner.series.apply(runner, arr.map(function (v, i) {
    return fn.bind(ctx, v, i, arr)
  })).then(function (results) {
    return [].concat.apply([], results)
  })
}


