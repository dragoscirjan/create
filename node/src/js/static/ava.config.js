// ava.config.js

const files = ["./{src,test}/**/*.{spec,test}.js"];

const environmentVariables = {};

module.exports = {
  babel: {
    extensions: ["js"],
    testOptions: {
      babelrc: true,
    },
  },
  extensions: ["js"],
  require: ["@babel/register"],
  files,
  environmentVariables,
};
