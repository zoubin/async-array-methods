var series = require('..').series

var log = console.log.bind(console)

var n = 1
series(
  [1, 2, 3, 4],
  function (v, i, arr, next) {
    var delay = rand()
    console.log('i:', i, 'delay:', delay)
    setTimeout(function() {
      next(null, v << n++)
    }, delay)
  }
)
// [2, 8, 24, 64]
.then(log)

function rand() {
  return Math.floor(Math.random() * 10) * 10
}
