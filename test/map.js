var test = require('tap').test;
var map = require('..').map;

test('map', function(t) {
  t.plan(3);
  map(
    [1, 2, 3, 4],
    function (v) {
      return v << 2;
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'sync');
    }
  );

  map(
    [1, 2, 3, 4],
    function (v, i, a, next) {
      process.nextTick(function () {
        next(null, v << 2);
      });
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'async');
    }
  );

  map(
    [1, 2, 3, 4],
    function (v) {
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(v << 2);
        });
      });
    },
    function (err, results) {
      t.same(results, [4, 8, 12, 16], 'promise');
    }
  );

});

