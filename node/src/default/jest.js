import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "./package-json.js";

export const jestConfig = {
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "jsx"],
  roots: ["."],
  testEnvironment: "node",
  testMatch: ["**/{src,test}/**/*.{spec,test}.js"],
};

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options, config = jestConfig) {
  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...object.scripts,
      test: "cross-env NODE_ENV=test BUILD_ENV=node-cjs NO_API_DOC=1 jest --coverage --runInBand --verbose",
      "test:jest": "npm run test:jest -- --watch",
    },
  }));

  const stringConfig = `// jest.config.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  return writeFile("jest.config.js", stringConfig, options);
}
