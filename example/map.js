var map = require('..').map;

map(
  [1, 2, 3, 4],
  function (v) {
    return v << 2;
  },
  function (err, results) {
    console.log('sync:', results);
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
    console.log('async:', results);
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
    console.log('promise:', results);
  }
);

