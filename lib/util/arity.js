'use strict'

var semver = require('semver')


// Starting in what we believe to be Node v4 you can set the name and length of
// a function as properties. This is more ideal than wrapping a function.
// TODO: Remove _fixArity_newFunc once Node v0.12 has been deprecated.
exports.fixArity =
  semver.satisfies(process.version, '>=4') ? _fixArity_prop : _fixArity_newFunc

function _fixArity_prop(original, wrapper) {
  Object.defineProperties(wrapper, {
    length: {
      configurable: true,
      enumerable: false,
      writable: true,
      value: original.length
    },
    name: {
      configurable: true,
      enumerable: false,
      writable: true,
      value: original.name
    },
    __NR_name: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: wrapper.name
    }
  })

  return wrapper
}

function _fixArity_newFunc(original, wrapper) {
  var name = String(original.name).replace(/[^\w_]/g, '_')
  var args = ''
  if (original.length > 0) {
    args = 'v0'
    for (var i = 1; i < original.length; ++i) {
      args += ', v' + i
    }
  }

  /* eslint-disable no-new-func */
  var renamed = new Function('wrapper', [
    'var arityWrapper = function ' + name + '(' + args + ') {',
    '  if (this instanceof arityWrapper) {',
    '    var len = arguments.length',
    '    var fnArgs = new Array(len)',
    '    for (var i = 0; i < len; ++i) {',
    '      fnArgs[i] = arguments[i]',
    '    }',
    '    fnArgs.unshift(wrapper) // `unshift` === `push_front`',
    '    return new (wrapper.bind.apply(wrapper, fnArgs))()',
    '  }',
    '  return wrapper.apply(this, arguments)',
    '}',
    'return arityWrapper'
  ].join('\n'))(wrapper)
  /* eslint-enable no-new-func */

  Object.defineProperty(renamed, '__NR_name', {
    enumerable: false,
    writable: true,
    value: wrapper.name
  })

  return renamed
}