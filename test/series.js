var test = require('tap').test
var series = require('../lib/series')

test('results', function(t) {
  t.plan(2)

  var res = []
  series([30, 20, 10], function (v, i, arr, next) {
    setTimeout(function() {
      res.push(v)
      next(null, i)
    }, v)
  }).then(function (results) {
    t.same(results, [0, 1, 2])
    t.same(res, [30, 20, 10])
  })
})

test('context', function(t) {
  t.plan(2)

  var res = []
  series([30, 20, 10], function (v, i, arr, next) {
    var self = this
    setTimeout(function() {
      res.push(v)
      next(null, i + self.n)
    }, v)
  }, { n: 1 }).then(function (results) {
    t.same(results, [1, 2, 3])
    t.same(res, [30, 20, 10])
  })
})

