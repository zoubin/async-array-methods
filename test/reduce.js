var test = require('tap').test;
var reduce = require('..').reduce;

test('reduce', function(t) {
  t.plan(3);
  reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return a + b;
    },
    10,
    function (err, results) {
      t.equal(results, 20, 'sync');
    }
  );

  reduce(
    [1, 2, 3, 4],
    function (a, b, i, arr, next) {
      process.nextTick(function () {
        next(null, a + b);
      });
    },
    10,
    function (err, results) {
      t.equal(results, 20, 'async');
    }
  );

  reduce(
    [1, 2, 3, 4],
    function (a, b) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(a + b);
        });
      });
    },
    10,
    function (err, results) {
      t.equal(results, 20, 'promise');
    }
  );

});

