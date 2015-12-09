var asyncMethods = {
  map: require('./map'),
  filter: require('./filter'),
  reduce: require('./reduce'),
  forEach: require('./forEach'),
}

function AsyncArray(arr) {
  if (!(this instanceof AsyncArray)) {
    return new AsyncArray(arr)
  }
  this.result = Promise.resolve(arr || [])
}

['map', 'filter', 'forEach', 'reduce']
.forEach(function (fnName) {
  AsyncArray.prototype[fnName] = function () {
    var args = slice(arguments)
    return new AsyncArray(this.result.then(function (arr) {
      return asyncMethods[fnName].apply(
        null, [arr].concat(args)
      )
    }))
  }
})

AsyncArray.prototype.then = function(onFulfilled, onRjected) {
  return this.result.then(onFulfilled, onRjected)
}

AsyncArray.prototype.catch = function(onRjected) {
  return this.result.catch(onRjected)
}

function slice(o, from, to) {
  return Array.prototype.slice.call(o, from, to)
}

module.exports = AsyncArray
