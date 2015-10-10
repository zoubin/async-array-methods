var each = require('./each')

module.exports = function (arr, fn, done) {
  each(arr, fn, 0, arr.length, [], done)
}

