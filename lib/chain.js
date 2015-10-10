var sequence = require('callback-sequence')

module.exports = function (arr, callbacks, done) {
  done = done || function () {}
  sequence.run(
    callbacks.map(bind),
    arr,
    function (err, res) {
      done(err, res.pop())
    }
  )
}

function bind(thing) {
  if (typeof thing === 'function') {
    return [thing, sequence.last]
  }
  if (Array.isArray(thing) && thing.length) {
    var res = thing.slice()
    res.splice(
      typeof res[0] === 'function' ? 1 : 2,
      0,
      sequence.last
    )
    return res
  }
  throw new Error('Input Error')
}

