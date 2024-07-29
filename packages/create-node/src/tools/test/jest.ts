/**
 * @link https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
 */

import PackageJson from "@npmcli/package-json";
import { AvailableLanguages, logger } from "@templ-project/core";
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
        ? "ts-jest typescript ts-node @jest/globals".split(" ")
        : []),
      "jest",
    ],
    {
      cwd: projectPath,
    },
  );

  await writeConfigFiles(projectPath);

  await writeTestFiles(projectPath, options);

  logger.debug("`jest`setup completed...");
};

export default jestSetup;

const writeConfigFiles = async (projectPath: string) => {
  // await writeFile(path.join(projectPath, "vitest.setup.js"), vitestConfig);

  return new PackageJson().load(projectPath).then((packageJson) =>
    packageJson
      .update({
        scripts: {
          ...packageJson.content.scripts,
          test: "cross-env NODE_ENV=test vitest run",
        },
      })
      .save(),
  );
};

const writeTestFiles = async (projectPath: string, options: ProgramOptions) => {
  await writeFile(
    path.join(projectPath, "src", `index.spec.${options.language}`),
    vitestSpecCode[options.language],
  );

  return writeFile(
    path.join(projectPath, "test", `index.test.${options.language}`),
    vitestTestCode[options.language],
  );
};

export const vitestConfig = `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"],
  },
});

`;

export const vitestSpecCode = {
  // coffee: '',
  js: /*js-*/ `import { hello } from "./index";

describe("hello", () => {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello("World")).toEqual("Hello, World!");
  });
});

`,
  ts: /*ts-*/ `import { hello } from "./index";

describe("hello", () => {
  it('hello("World") to return "Hello World!"', function () {
    expect(hello("World")).toEqual("Hello, World!");
  });
});

`,
};

export const vitestTestCode = {
  // coffee: '',
  js: /*js-*/ `/* eslint-disable max-lines-per-function */
import {describe, expect, test} from '@jest/globals';
import { writeHello } from "../src";

describe("writeHello", () => {
  let consoleSpy;

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

`,
  ts: /*ts-*/ `/* eslint-disable max-lines-per-function */
import {describe, expect, test} from '@jest/globals';
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

`,
};
