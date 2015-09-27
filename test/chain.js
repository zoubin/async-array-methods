var test = require('tap').test;
var chain = require('..').chain;

test('chain', function(t) {
  t.plan(5);
  chain(
    [1, 2, 3, 4],
    function (res) {
      t.same(res, [1, 2, 3, 4]);
      return res;
    },
    ['filter', odd],
    function (res, next) {
      t.same(res, [1, 3]);
      process.nextTick(function () {
        next(null, res);
      });
    },
    ['map', plusplus],
    function (res) {
      t.same(res, [2, 4]);
      return new Promise(function (rs) {
        process.nextTick(function () {
          rs(res);
        });
      });
    },
    ['reduce', sum, 10],
    function (err, res) {
      t.error(err);
      t.same(res, 16);
    }
  );

});

function odd(v) {
  return v % 2;
}

function plusplus(v, i, a, next) {
  process.nextTick(function () {
    next(null, ++v);
  });
}

function sum(a, b) {
  return new Promise(function (rs) {
    process.nextTick(function () {
      rs(a + b);
    });
  });
}

