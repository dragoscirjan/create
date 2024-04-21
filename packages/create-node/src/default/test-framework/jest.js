import writeFile from "../../util/write-file.js";
import { update as updatePackageJson } from "../package-json.js";

export const jestConfig = (language) => ({
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: [...new Set(["js", language, "json", `${language}x`])],
  roots: ["."],
  testEnvironment: "node",
  testMatch: [`**/{src,test}/**/*.{spec,test}.${language}`],
});

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options, config = null) {
  const { language, logger, testFramework } = options;
  logger.verbose(`configuring ${testFramework}...`);

  config = config || jestConfig(language);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: `cross-env NODE_ENV=test ${language === "js" ? "BUILD_ENV=node-cjs" : ""} NO_API_DOC=1 jest --coverage --runInBand --verbose`,
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// jest.config.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  return writeFile("jest.config.js", stringConfig, options);
}
