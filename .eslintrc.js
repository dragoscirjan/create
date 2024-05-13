module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'plugin:sonar/recommended',
    'plugin:prettier/recommended',
    // "plugin:import/recommended",
    // "plugin:import/warnings",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.eslint.json', './packages/*/tsconfig.build.json'],
  },
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'sonar',
    'prettier',
    // "import"
  ],
  rules: {
    'consistent-return': 2,
    'max-len': ['error', 120],
    'max-lines-per-function': ['error', 40],
    'max-params': ['error', 3],
    'no-else-return': 1,
    quotes: ['warn', 'single', {avoidEscape: true}],
    'sonar/no-invalid-await': 0,
    'space-unary-ops': 2,
    curly: ['error', 'all'],
    indent: [1, 2],
    semi: [1, 'always'],
  },
  // settings: {
  //   "import/parsers": {
  //     "@typescript-eslint/parser": [".ts", ".tsx"],
  //   },
  //   "import/resolver": {
  //     typescript: {
  //       project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.build.json"],
  //     },
  //     node: {
  //       project: ["./tsconfig.eslint.json", "./packages/*/tsconfig.build.json"],
  //     },
  //   },
  // },
};
