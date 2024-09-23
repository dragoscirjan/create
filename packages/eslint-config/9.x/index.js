// eslint.config.js

const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    rules: {
      'consistent-return': 'error',
      'max-len': ['error', 120],
      'max-lines-per-function': ['error', 40],
      'max-params': ['error', 3],
      'no-else-return': 'warn',
      'sonarjs/no-invalid-await': 'off', // Correct rule name
      'space-unary-ops': 'error',
      curly: ['error', 'all'],
      indent: ['warn', 2],
      semi: ['warn', 'always'],
      'no-use-before-define': 'off',
      'no-restricted-syntax': 'warn',
      'no-await-in-loop': 'warn',
      'no-return-await': 'warn',
      'no-param-reassign': 'warn',
    },
  },
];
