var run = require('run-callback')

module.exports = function (arr, fn, done) {
  var pending = arr.length
  var results = []
  var errored = false
  if (arr.length === 0) {
    return done(null, [])
  }
  arr.forEach(function (v, i) {
    run([fn, v, i, arr], function (err, r) {
      if (errored) {
        return
      }
      if (err) {
        errored = true
        return done(err)
      }
      results[i] = r
      if (--pending === 0) {
        done(null, results)
      }
    })
  })
}

