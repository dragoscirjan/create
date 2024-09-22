// .babelrc.js

module.exports = {
  ...require("./base"),
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        modules: false,
        targets: { "deno": "1.20" },
      },
    ],
  ],
};
