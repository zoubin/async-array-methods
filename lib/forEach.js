var run = require('run-callback')

module.exports = function (arr, fn, done) {
  each(arr, fn, 0, arr.length, [], done)
}

function each(arr, fn, start, end, res, done) {
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

