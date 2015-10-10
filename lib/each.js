var run = require('run-callback')

module.exports = function each(arr, fn, start, end, res, done) {
  if (end <= start) {
    return done(null, res)
  }
  run([fn, arr[start], start, arr], function (err, r) {
    if (err) {
      return done(err, res)
    }
    res.push(r)
    each(arr, fn, ++start, end, res, done)
  })
}

