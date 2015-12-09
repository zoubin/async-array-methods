var map = require('./map')

module.exports = function (arr, fn, ctx) {
  if (arguments.length < 3) {
    ctx = arr
  }
  return map(arr, fn, ctx).then(function (res) {
    return arr.filter(function (_, i) {
      return res[i]
    })
  })
}

