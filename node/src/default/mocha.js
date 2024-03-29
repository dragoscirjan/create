import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "./package-json.js";

export const mochaConfig = {
  recursive: true,
  reporter: "spec",
  timeout: 5000,
  require: ["chai/register-assert.js", "chai/register-expect.js", "chai/register-should.js"],
};

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options, config = mochaConfig) {
  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: 'npm run test:single -- "./{src,test}/**/*.{spec,test}.js"',
      "test:single": "cross-env NODE_ENV=test BUILD_ENV=node-cjs nyc --extension .js mocha --forbid-only",
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// .mocharc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  return writeFile(".mocharc.js", stringConfig, options);
}
