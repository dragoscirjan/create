module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  extends: ['@templ-project/tslint-config'],
  parserOptions: {
    project: './tsconfig.build.json',
  },
};
