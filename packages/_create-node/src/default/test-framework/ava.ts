import { avaSpecJs, avaTestJs } from "../../constants.js";
import { CreateCommandOptions } from "../../types.js";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import writeTestFiles from "./write-test-files.js";

export default async function (
  options: CreateCommandOptions,
  spec = avaSpecJs,
  test = avaTestJs,
) {
  const { logger, testFramework } = options;
  logger?.verbose(`configuring ${testFramework}...`);

  await updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...(object as PackageJsonOptions).scripts,
      test: "cross-env NODE_ENV=test BUILD_ENV=node-cjs nyc ava",
      "test:watch": "npm run test -- --watch",
    },
  }));

  return writeTestFiles(options, test, spec);
}
