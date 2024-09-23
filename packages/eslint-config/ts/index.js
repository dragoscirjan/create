// .eslintrc.js

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
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/no-duplicates': 'off',
    'import/order': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        paths: './tsconfig/types.json',
        alwaysTryTypes: true,
      },
    },
  },
};
