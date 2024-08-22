/**
 * @link https://jestjs.io/docs/getting-started#using-babel
 *
 * @link https://jestjs.io/docs/getting-started#using-typescript
 * - @link https://kulshekhar.github.io/ts-jest/docs/getting-started/installation#jest-config-file
 */

import PackageJson from "@npmcli/package-json";
import {
  AvailableLanguages,
  AvailableTargets,
  logger,
  targetIsEsm,
  transpileTs,
} from "@templ-project/core";
import { ProgramOptions } from "../../options.js";
import { installDevDependencies } from "@templ-project/core";
import { writeFile } from "fs/promises";
import path from "path";

import testSetup from "./default.js";

const jestSetup = async (projectPath: string, options: ProgramOptions) => {
  logger.debug("Setting up `jest`...");

  await testSetup(projectPath, options);

  await installDevDependencies(
    options.packageManager,
    [
      // https://jestjs.io/docs/getting-started#using-babel
      ...(options.language === AvailableLanguages.Js
        ? "babel-jest @babel/core @babel/preset-env @templ-project/babel-config".split(
            " ",
          )
        : []),
      // https://jestjs.io/docs/getting-started#using-typescript
      ...(options.language === AvailableLanguages.Ts
        ? "ts-jest typescript ts-node".split(" ")
        : []),
      ..."jest @jest/globals".split(" "),
    ],
    {
      cwd: projectPath,
    },
  );

  await writeConfigFiles(projectPath, options);

  await writeTestFiles(projectPath, options);

  logger.debug("`jest`setup completed...");
};

export default jestSetup;

const writeConfigFiles = async (
  projectPath: string,
  options: ProgramOptions,
) => {
  const { language, target } = options;
  if (
    language === AvailableLanguages.Js &&
    target.includes(AvailableTargets.Esm) &&
    target.length === 1
  ) {
    // logger.error(
    //   "Unfortunately we do not support Jest with ESM for now, when writing EcmaScript.",
    // );
    // process.exit(1);
  }
  await writeBabelConfig(projectPath, options);

  await writeJestConfig(projectPath, options);

  return new PackageJson().load(projectPath).then((packageJson) =>
    packageJson
      .update({
        scripts: {
          ...packageJson.content.scripts,
          test: `cross-env ${
            language === AvailableLanguages.Js && targetIsEsm(target)
              ? 'NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules"'
              : ""
          } NODE_ENV=test NO_API_DOC=1 jest --coverage --runInBand --verbose`,
        },
      })
      .save(),
  );
};

const writeBabelConfig = async (
  projectPath: string,
  options: ProgramOptions,
) => {
  const { language, target } = options;

  if (language === AvailableLanguages.Js && !targetIsEsm(target)) {
    // TODO: make sure babel.config.js exists
    writeFile(
      path.join(projectPath, "babel.config.js"),
      `module.exports = {
  presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
};

`,
    );
  }
};

const writeJestConfig = async (
  projectPath: string,
  options: ProgramOptions,
) => {
  const { target } = options;

  return writeFile(
    path.join(projectPath, "jest.config.js"),
    transpileTs(options.language, buildJestConfig(options), {
      mode: targetIsEsm(target) ? "strip" : "cjs",
    }),
  );
};

const buildJestConfig = (options: ProgramOptions): string => {
  const { language, target } = options;

  const jestConfig = {
    testEnvironment: "node",
    transform: {
      ...(language === AvailableLanguages.Js && !targetIsEsm(target)
        ? transformJs
        : {}),
      ...(language === AvailableLanguages.Ts ? transformTs : {}),
    },
  };

  return `/** ${
    language === AvailableLanguages.Ts
      ? '@type {import("ts-jest").JestConfigWithTsJest}'
      : '@type {import("jest").Config}'
  } **/
${targetIsEsm(target) ? "export default" : "module.exports ="} ${JSON.stringify(jestConfig, null, 2)}`;
};

const writeTestFiles = async (projectPath: string, options: ProgramOptions) => {
  await writeFile(
    path.join(projectPath, "src", `index.spec.${options.language}`),
    transpileTs(options.language, jestSpecCode, { mode: "strip" }),
  );

  return writeFile(
    path.join(projectPath, "test", `index.test.${options.language}`),
    transpileTs(options.language, jestTestCode, { mode: "strip" }),
  );
};

export const transformJs = { "^.+\\.jsx?$": ["babel-jest", {}] };

export const transformTs = { "^.+\\.tsx?$": ["ts-jest", {}] };

export const jestSpecCode = /*ts-*/ `import {describe, expect, it} from '@jest/globals';
import { hello } from "./index";

describe("hello", () => {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello("World")).toEqual("Hello, World!");
  });
});

`;

export const jestTestCode = /*ts-*/ `/* eslint-disable max-lines-per-function */
import {describe, expect, it, beforeAll, afterAll, afterEach, jest} from '@jest/globals';
import { writeHello } from "../src";

describe("writeHello", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleSpy: any;

  beforeAll(() => {
    // Spy on console.log and provide a mock implementation
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear mock call history after each test
    consoleSpy.mockClear();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    consoleSpy.mockRestore();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    writeHello("World");
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Hello, World!");
  });
});

`;
