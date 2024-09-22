import baseConfig from '../index'; // Import the base JS ESLint config
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier';
import sonarjs from 'eslint-plugin-sonarjs';

// Base configuration for TypeScript files
const tsConfig = {
  files: ['**/*.ts', '**/*.tsx'], // Apply this config to all TypeScript files
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      project: './tsconfig.json', // Specify the path to your tsconfig file if needed
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    import: importPlugin,
    sonarjs,
    prettier,
  },
  extends: [
    baseConfig, // Extend from the JS config
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-infix-ops': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'off', // Use the TypeScript rule instead
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  settings: {
    'import/resolver': {
      typescript: {}, // Adds support for resolving TypeScript imports
    },
  },
};

// Export the combined ESLint configuration
export default [baseConfig, tsConfig];
