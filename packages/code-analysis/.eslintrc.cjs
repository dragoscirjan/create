module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2022: true,
  },
  extends: ["@templ-project/eslint-config-ts"],
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-unresolved": "error",
  },
};
