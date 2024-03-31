import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "./package-json.js";

export const mochaConfig = (language) => ({
  extensions: [language],
  spec: `./{src,test}/**/*.{spec,test}.${language}`,
  recursive: true,
  reporter: "spec",
  timeout: 5000,
  require: ["chai/register-assert.js", "chai/register-expect.js", "chai/register-should.js"],
});

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options, config = null) {
  const { language, logger, testFramework } = options;
  config = config || mochaConfig(language);
  logger.verbose(`configuring (${language}) ${testFramework}...`);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: `npm run test:single`,
      // BUILD_ENV is for babel
      "test:single": `cross-env NODE_ENV=test ${language === "js" ? "BUILD_ENV=node-cjs" : 'TS_NODE_PROJECT="./tsconfig.test.json"'} nyc mocha --forbid-only`,
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// .mocharc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  return writeFile(".mocharc.js", stringConfig, options);
}
