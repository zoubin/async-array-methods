var map = require('./map')

module.exports = function (arr, fn, done) {
  map(arr, fn, function (err, results) {
    done(err, arr.filter(function (_, i) {
      return results[i]
    }))
  })
}

