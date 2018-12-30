import commonjs from 'rollup-plugin-commonjs'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

const input = './compiled/index.js'
const external = id => !id.startsWith('.') && !id.startsWith('/')

const babelOptions = {
  exclude: /node_modules/,
  plugins: [
    [
      'transform-react-remove-prop-types',
      {
        mode: 'remove',
        removeImport: true
      }
    ],
    'annotate-pure-calls',
    'dev-expression'
  ]
}

const rollupUmd = ({ env }) => ({
  input,
  external: ['react', 'react-native'],
  output: {
    name: 'yafl',
    format: 'umd',
    sourcemap: true,
    file: `./lib/yafl.umd.${env}.js`,
    exports: 'named',
    globals: {
      react: 'React',
      'react-native': 'ReactNative'
    }
  },

  plugins: [
    resolve(),
    babel(babelOptions),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'node_modules/prop-types/index.js': [
          'object',
          'oneOf',
          'oneOfType',
          'string',
          'number',
          'array',
          'arrayOf',
          'node',
          'func',
          'bool',
          'element'
        ]
      }
    }),
    sourceMaps(),
    env === 'production' && sizeSnapshot(),
    env === 'production' &&
      uglify({
        output: { comments: false },
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true,
        toplevel: false
      })
  ]
})

const rollupCjs = ({ env }) => ({
  input,
  external,
  output: [
    {
      file: `./lib/${pkg.name}.cjs.${env}.js`,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    replace({
      exclude: 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    sourceMaps(),
    sizeSnapshot()
  ]
})

export default [
  rollupUmd({ env: 'production' }),
  rollupUmd({ env: 'development' }),
  rollupCjs({ env: 'production' }),
  rollupCjs({ env: 'development' }),
  {
    input,
    external,
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      }
    ],
    plugins: [resolve(), babel(babelOptions), sourceMaps(), sizeSnapshot()]
  }
]
