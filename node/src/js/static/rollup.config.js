// rollup.config.js

const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");

const babelConfig = require("./.babelrc");

// Use `process.env.BUILD_ENV` to set the environment
const buildEnv = process.env.BUILD_ENV || "node-esm"; // Default to 'node-esm'

module.exports = [
  // Browser build
  ...(buildEnv === "browser"
    ? [
        {
          input: "src/index.js",
          output: {
            file: "dist/browser/index.js",
            format: "es", // or 'umd' if you need browser and Node.js support
          },
          plugins: [
            resolve(), // resolves third-party modules in node_modules
            commonjs(), // conve.js CommonJS modules to ES6
            babel(babelConfig),
          ],
        },
      ]
    : []),
  // CommonJS build for Node.js
  ...(buildEnv === "node-cjs"
    ? [
        {
          input: "src/index.js",
          output: {
            file: "dist/node-cjs/index.js",
            format: "cjs",
          },
          plugins: [babel(babelConfig), resolve(), commonjs()],
        },
      ]
    : []),
  // ESM build
  ...(buildEnv === "node-esm"
    ? [
        {
          input: "src/index.js",
          output: {
            file: "dist/node-esm/index.js",
            format: "es",
          },
          plugins: [resolve(), commonjs(), babel(babelConfig)],
        },
      ]
    : []),
];
