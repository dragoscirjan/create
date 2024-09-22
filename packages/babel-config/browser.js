// .babelrc.js

module.exports = {
  ...require("./base"),
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        forceAllTransforms: true,
        modules: false,
        targets: "> 0.25%, not dead, last 2 versions",
        useBuiltIns: "usage",
      },
    ],
  ],
};
