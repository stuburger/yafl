import commonjs from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import filesize from 'rollup-plugin-filesize'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

const input = './compiled/index.js'
const external = ['react', 'react-native']

function rollupUmd({ env }) {
  return {
    input,
    external,
    output: {
      name: 'kwik-form',
      format: 'umd',
      sourcemap: true,
      file: env === 'production' ? './lib/kwik-form.umd.min.js' : './lib/kwik-form.umd.js',
      exports: 'named',
      globals: {
        react: 'React',
        'react-native': 'ReactNative'
      }
    },

    plugins: [
      resolve(),
      replace({
        exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(env)
      }),
      commonjs({
        include: /node_modules/
        // namedExports: {
        //   'node_modules/prop-types/index.js': [
        //     'object',
        //     'oneOfType',
        //     'string',
        //     'node',
        //     'func',
        //     'bool',
        //     'element'
        //   ]
        // }
      }),
      sourceMaps(),
      env === 'production' && filesize(),
      env === 'production' &&
        uglify({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true
          },
          warnings: true,
          ecma: 5,
          toplevel: false
        }),
      typescript()
    ]
  }
}

const rollupCjs = ({ env }) => ({
  input,
  external: external.concat(Object.keys(pkg.dependencies)),
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
    filesize()
  ]
})

export default [
  rollupUmd({ env: 'production' }),

  rollupUmd({ env: 'development' }),

  rollupCjs({ env: 'development' }),

  rollupCjs({ env: 'production' }),

  {
    input,
    external: external.concat(Object.keys(pkg.dependencies)),
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
    plugins: [resolve(), sourceMaps(), filesize()]
  }
]
