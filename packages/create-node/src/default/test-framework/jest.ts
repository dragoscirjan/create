import { CreateCommandOptions, ProgrammingLanguage } from "../../types";
import writeFile from "../../util/write-file";
import { update as updatePackageJson } from "../create/package-json";

export type JestConfig = {
  clearMocks: boolean;
  coverageDirectory: string;
  moduleFileExtensions: string[];
  roots: string[];
  testEnvironment: string;
  testMatch: string[];
  [key: string]: any;
};

export const jestConfig = (language: ProgrammingLanguage): JestConfig => ({
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: [...new Set(["js", language, "json", `${language}x`])],
  roots: ["."],
  testEnvironment: "node",
  testMatch: [`**/{src,test}/**/*.{spec,test}.${language}`],
});

export default async function (
  options: CreateCommandOptions,
  config?: JestConfig
) {
  const { language, logger, testFramework } = options;
  logger?.verbose(`configuring ${testFramework}...`);

  config = config || jestConfig(language!);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...(object as any).scripts,
      test: `cross-env NODE_ENV=test ${
        language === "js" ? "BUILD_ENV=node-cjs" : ""
      } NO_API_DOC=1 jest --coverage --runInBand --verbose`,
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// jest.config.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  return writeFile("jest.config.js", stringConfig, options);
}
