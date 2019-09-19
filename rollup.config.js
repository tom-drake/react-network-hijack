import autoExternal from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';

const moduleConfig = moduleFormat => ({
  input: './src/index.js',
  output: {
    file: `./build/bundle.${moduleFormat}.js`,
    format: moduleFormat,
    name: `bundle.${moduleFormat}`
  },
  plugins: [
    progress(),
    nodeResolve({
      browser: true
    }),
    babel({
      babelrc: false,
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties']
    }),
    autoExternal(),
    visualizer({
      filename: `reports/bundle.${moduleFormat}.html`
    }),
    filesize()
  ]
});

export default ['esm', 'cjs'].map(moduleConfig);
