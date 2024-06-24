module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  extends: ['@templ-project/eslint-config-ts'],
  parserOptions: {
    project: './tsconfig.build.json',
    sourceType: "module",
  }
};
