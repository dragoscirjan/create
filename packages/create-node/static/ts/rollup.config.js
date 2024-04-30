// rollup.config.js

const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");

// Use `process.env.BUILD_ENV` to set the environment
const buildEnv = process.env.BUILD_ENV || "node-esm"; // Default to 'node-esm'

module.exports = [
  {
    input: "src/index.ts",
    output: {
      file: `dist/${buildEnv}/index.js`,
      format: buildEnv === "node-cjs" ? "cjs" : "es", // or 'umd' if you need browser and Node.js support
    },
    plugins: [typescript(), resolve(), commonjs()],
  },
];
