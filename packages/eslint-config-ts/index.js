// .eslint.cjs

module.exports = {
  root: true,
  extends: [
    '@templ-project/eslint-config',
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
