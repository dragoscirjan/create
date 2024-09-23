const tsEslint = require('typescript-eslint');

const baseConfig = require('../index');

module.exports = tsEslint.config(baseConfig, ...tsEslint.configs.recommended, {
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
  },
});
