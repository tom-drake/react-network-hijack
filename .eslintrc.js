module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['prettier'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['story/*.js'] }
    ],
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 0,
    'react/no-multi-comp': 0,
    'react/prop-types': 0,
    'react/static-property-placement': 0
  }
};
