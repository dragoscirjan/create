// .eslint.cjs

module.exports = {
  root: true,
  extends: ['@templ-project/eslint-config', 'plugin:@typescript-eslint/recommended'],
  // plugins: ['@typescript-eslint'], // 'sonarjs', 'prettier', 'import'
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
  },
};
