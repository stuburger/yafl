'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./yafl.cjs.production.js')
} else {
  module.exports = require('./yafl.cjs.development.js')
}
