'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./rect-yafl.cjs.production.js')
} else {
  module.exports = require('./rect-yafl.cjs.development.js')
}
