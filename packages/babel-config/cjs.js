// .babelrc.js

module.exports = {
  ...require("./base"),
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        loose: true,
        modules: "commonjs",
        targets: { node: "current" },
        useBuiltIns: "usage",
      },
    ],
  ],
};
