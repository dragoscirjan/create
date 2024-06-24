// .eslint.cjs

module.exports = {
  env: {
    node: true, // Enable Node.js environment
    es2022: true, // Enable ES2022 globals
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/warnings',
    'eslint-config-airbnb-base', // TODO: decide whether to use or not
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['sonarjs', 'prettier', 'import'],
  root: true,
  rules: {
    'consistent-return': 2,
    'max-len': ['error', 120],
    'max-lines-per-function': ['error', 40],
    'max-params': ['error', 3],
    'no-else-return': 1,
    'sonar/no-invalid-await': 0,
    'space-unary-ops': 2,
    curly: ['error', 'all'],
    indent: [1, 2],
    semi: [1, 'always'],
    'no-use-before-define': 0,
    'no-restricted-syntax': ['warn'],
    'no-await-in-loop': 'warn',
    'no-return-await': 'warn',
    'no-param-reassign': 'warn',
  },
};
