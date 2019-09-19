module.exports = {
  plugins: ['@babel/plugin-proposal-class-properties'],
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        corejs: '2',
        useBuiltIns: 'usage'
      }
    ]
  ]
};
