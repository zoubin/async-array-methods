var run = require('run-callback');
var sequence = require('callback-sequence');
var arrayify = require('arrayify-slice');

exports.map = map;
exports.filter = filter;
exports.reduce = reduce;
exports.chain = chain;

function chain(arr) {
  var args = arrayify(arguments, 1);
  var done = args.pop();
  if (typeof done !== 'function') {
    args.push(done);
    done = function () {};
  }
  sequence.run(
    args.map(bind),
    arr,
    function (err, res) {
      done(err, res.pop());
    }
  );
}

function bind(thing) {
  if (typeof thing === 'function') {
    return [thing, sequence.last];
  }
  if (Array.isArray(thing) && thing.length) {
    var res = [
      typeof thing[0] === 'string' ? exports[thing[0]] : thing[0],
      sequence.last,
    ];
    res.push.apply(res, thing.slice(1));
    return res;
  }
  throw new Error('Input Error');
}

function map(arr, fn, done) {
  each(arr, fn, 0, arr.length, [], done);
}

function filter(arr, fn, done) {
  map(arr, fn, function (err, results) {
    done(err, arr.filter(function (_, i) {
      return results[i];
    }));
  });
}

function reduce(arr, fn, initial, done) {
  var start;
  var end = arr.length;
  var last;
  if (arguments.length < 4) {
    start = 1;
    if (end < 1) {
      throw new Error('Reduce of empty array with no initial value');
    }
    last = arr[0];
    done = initial;
  } else {
    start = 0;
    last = initial;
  }

  (function next(i) {
    if (end <= i) {
      return done(null, last);
    }
    run(fn, last, arr[i], i, arr, function (err, r) {
      if (err) {
        return done(err, last);
      }
      last = r;
      next(++i);
    });
  }(start));
}

function each(arr, fn, start, end, res, done) {
  if (end <= start) {
    return done(null, res);
  }
  run(fn, arr[start], start, arr, function (err, r) {
    if (err) {
      return done(err, res);
    }
    res.push(r);
    each(arr, fn, ++start, end, res, done);
  });
}

