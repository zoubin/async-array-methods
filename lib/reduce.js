var run = require('run-callback')

module.exports = function (arr, fn, initial, done) {
  var start
  var end = arr.length
  var last
  if (arguments.length < 4) {
    start = 1
    if (end < 1) {
      throw new Error('Reduce of empty array with no initial value')
    }
    last = arr[0]
    done = initial
  } else {
    start = 0
    last = initial
  }

  (function next(i) {
    if (end <= i) {
      return done(null, last)
    }
    run([fn, last, arr[i], i, arr], function (err, r) {
      if (err) {
        return done(err, last)
      }
      last = r
      next(++i)
    })
  }(start))
}


