import { writeFile } from "fs/promises";
/**
 * @link https://vitejs.dev/guide/
 * @link https://vitest.dev/guide/
 */
import path from "path";

import PackageJson from "@npmcli/package-json";
import {
  AvailableLanguages,
  installDevDependencies,
  logger,
  transpileTs,
} from "@templ-project/core";

import { ProgramOptions } from "../../options.js";
import testSetup from "./default.js";

const vitestSetup = async (projectPath: string, options: ProgramOptions) => {
  logger.debug("Setting up `vitest`...");

  await testSetup(projectPath, options);

  await installDevDependencies(
    options.packageManager,
    [
      ...(options.language === AvailableLanguages.Js ? [] : []),
      ...(options.language === AvailableLanguages.Ts
        ? ["typescript", "ts-node"]
        : []),
      "vitest",
    ],
    {
      cwd: projectPath,
    },
  );

  await writeConfigFiles(projectPath);

  await writeTestFiles(projectPath, options);

  logger.debug("`vitest`setup completed...");
};

export default vitestSetup;

const writeConfigFiles = async (projectPath: string) => {
  await writeFile(path.join(projectPath, "vitest.setup.js"), vitestConfig);

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
    transpileTs(options.language, vitestSpecCode, { mode: "strip" }),
  );

  return writeFile(
    path.join(projectPath, "test", `index.test.${options.language}`),
    transpileTs(options.language, vitestTestCode, { mode: "strip" }),
  );
};

export const vitestConfig = /*js-*/ `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"],
  },
});

`;

export const vitestSpecCode = /*ts-*/ `import {test, expect} from 'vitest';

import {hello} from './index';

test("hello('World') should return 'Hello, World!'", () => {
  expect(hello('World')).toBe('Hello, World!');
});

`;

export const vitestTestCode = /*ts-*/ `/* eslint-disable max-lines-per-function */
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from "vitest";

import { writeHello } from "../src";
import { transpileTs } from '../../../../core/src/transpile';

describe("writeHello", () => {
  let consoleMock;

  beforeAll(() => {
    consoleMock = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleMock.mockClear();
  });

  afterAll(() => {
    consoleMock.mockReset();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    // Call the function under test
    writeHello("World");

    // Assert that console.log was called once with the expected argument
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith("Hello, World!");
  });
});

  `;
