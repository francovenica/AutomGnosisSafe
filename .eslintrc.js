module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'eslint-config-standard',
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-node',
    'eslint-plugin-promise'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
  }
}
