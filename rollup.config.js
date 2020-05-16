import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

function rollup({ format, env }) {
  return {
    input: 'compiled/index.js',
    external: ['react'],
    output: {
      format,
      file: `dist/yafl.${format}.${env}.js`,
    },
    plugins: [
      babel()
    ]
  }
}


export default [
  rollup({ format: 'esm', env: 'production' }),
  rollup({ format: 'cjs', env: 'development' }),
  rollup({ format: 'cjs', env: 'production' }),
  rollup({ format: 'umd', env: 'development' }),
  rollup({ format: 'umd', env: 'production' }),
]