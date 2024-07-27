import { mochaSpecJs, mochaTestJs } from "../../constants.js";
import { CreateCommandOptions, ProgrammingLanguage } from "../../types.js";
import writeFile from "../../util/write-file.js";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import writeTestFiles from "./write-test-files.js";

export type MochaConfig = {
  extensions: string[];
  spec: string;
  recursive: boolean;
  reporter: string;
  timeout: number;
  require: string[];
  [key: string]: unknown;
};

export const mochaConfig = (language: ProgrammingLanguage): MochaConfig => ({
  extensions: [language],
  spec: `./{src,test}/**/*.{spec,test}.${language}`,
  recursive: true,
  reporter: "spec",
  timeout: 5000,
  require: [
    "chai/register-assert.js",
    "chai/register-expect.js",
    "chai/register-should.js",
  ],
});

export default async function (
  options: CreateCommandOptions,
  config?: MochaConfig,
  spec = mochaSpecJs,
  test = mochaTestJs,
) {
  const { language, logger, testFramework } = options;
  config = config || mochaConfig(language!);
  logger?.verbose(`configuring (${language}) ${testFramework}...`);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(object as PackageJsonOptions).scripts,
      test: "npm run test:single",
      // BUILD_ENV is for babel
      "test:single": `cross-env NODE_ENV=test ${language === "js" ? "BUILD_ENV=node-cjs" : ""} nyc mocha --forbid-only`,
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// .mocharc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  await writeFile(".mocharc.js", stringConfig, options);

  return writeTestFiles(options, test, spec);
}
