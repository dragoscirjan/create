// .eslintrc.js

module.exports = {
  root: true,
  extends: [
    '../index',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
