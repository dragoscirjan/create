import writeFile from "../../util/write-file.js";

import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import { CreateCommandOptions } from "../../types.js";
import writeTestFiles from "./write-test-files.js";
import { vitestSpecJs, vitestTestJs } from "../../constants.js";

export type VitestConfig = {
  test: {
    include: string[];
    reporters: string[];
  };
  [key: string]: unknown;
};

export const vitestConfig: VitestConfig = {
  test: {
    include: ["test/**/*.test"],
    reporters: ["verbose"],
  },
};

export default async function <T extends CreateCommandOptions>(
  options: T,
  config = vitestConfig,
  spec = vitestSpecJs,
  test = vitestTestJs,
) {
  const { logger, testFramework } = options;
  logger?.verbose(`configuring ${testFramework}...`);

  const configString = `// vitest.config

import {defineConfig} from "vite";

export default defineConfig(${JSON.stringify(config, null, 2)});`;

  await writeFile("vitest.config", configString, options);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(object as PackageJsonOptions).scripts,
      test: "npm run test:watch -- --run",
      "test:watch": "cross-env NODE_ENV=test vitest",
    },
  }));

  return writeTestFiles(options, test, spec);
}
