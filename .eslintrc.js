module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true
  },
  ecmaFeatures: {
    modules: true,
    allowImportExportEverywhere: true // ！允许不在文件头import和export，为了兼容react-hot-loader
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': 0,
    'indent': 0,
    'no-multiple-empty-lines': [1, {max: 3}],
    "space-before-function-paren": 0,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
  }
}
