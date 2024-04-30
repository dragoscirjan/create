const babel = require("@rollup/plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");

const babelConfig = require("./.babelrc");

// Use `process.env.BUILD_ENV` to set the environment
const buildEnv = process.env.BUILD_ENV || "node-esm"; // Default to 'node-esm'

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: `dist/${buildEnv}/index.js`,
      format: buildEnv === "node-cjs" ? "cjs" : "es", // or 'umd' if you need browser and Node.js support
    },
    plugins: [
      resolve(), // resolves third-party modules in node_modules
      commonjs(), // conve.js CommonJS modules to ES6
      babel(babelConfig),
    ],
  },
];
