import { CreateCommandOptions } from "../../types";
import { update as updatePackageJson } from "../create/package-json";

export default async function (options: CreateCommandOptions) {
  const { logger, testFramework } = options;
  logger?.verbose(`configuring ${testFramework}...`);

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...(object as any).scripts,
      test: "cross-env NODE_ENV=test BUILD_ENV=node-cjs nyc ava",
      "test:watch": "npm run test -- --watch",
    },
  }));
}
