// ava.config.js

const files = ["./{src,test}/**/*.{spec,test}.ts"];

const environmentVariables = {};

module.exports = {
  babel: {
    extensions: ["ts"],
    testOptions: {
      babelrc: true,
    },
  },
  extensions: {
    ts: "module",
  },
  require: ["ts-node/register"],
  files,
  environmentVariables,
  nodeArguments: ["--import=tsimp"],
};
