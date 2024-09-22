// eslint.config.js

import babelParser from '@babel/eslint-parser';
import recommended from 'eslint:recommended';
import airbnb from 'eslint-config-airbnb-base';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
      },
    },
    plugins: {
      import: importPlugin,
      sonarjs,
      prettier,
    },
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
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    // Import the base configurations as presets
    extends: [
      recommended,
      airbnb,
      'plugin:sonarjs/recommended',
      prettier,
    ],
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];
