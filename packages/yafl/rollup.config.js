import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import sourcemaps from 'rollup-plugin-sourcemaps'
import pkg from './package.json'

const babelOptions = {
  babelHelpers: 'inline',
  exclude: /node_modules/,
  plugins: ['annotate-pure-calls', 'dev-expression'],
}

const input = './compiled/index.js'
const external = (id) => !id.startsWith('.') && !id.startsWith('/')

function buildCjs({ env }) {
  return {
    input,
    external,
    output: {
      format: 'cjs',
      file: `dist/yafl.cjs.${env}.js`,
      sourcemap: true,
    },
    plugins: [
      resolve(),
      replace({
        exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      babel(babelOptions),
      sourcemaps(),
      env === 'production' && sizeSnapshot(),
    ],
  }
}

function buildUmd({ env }) {
  return {
    input,
    external,
    output: {
      name: 'yafl',
      format: 'umd',
      sourcemap: true,
      file: `./dist/yafl.umd.${env}.js`,
      exports: 'named',
      globals: {
        react: 'React',
        'react-native': 'ReactNative',
      },
    },
    plugins: [
      resolve(),
      babel(babelOptions),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      commonjs({
        include: /node_modules/,
      }),
      sourcemaps(),
      env === 'production' && sizeSnapshot(),
      env === 'production' &&
        terser({
          sourcemap: true,
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: true,
          warnings: true,
        }),
    ],
  }
}

function buildEsm() {
  return {
    input,
    external,
    output: {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: [resolve(), babel(babelOptions), sourcemaps(), sizeSnapshot()],
  }
}

export default [
  buildCjs({ env: 'development' }),
  buildCjs({ env: 'production' }),
  buildUmd({ env: 'development' }),
  buildUmd({ env: 'production' }),
  buildEsm(),
]
