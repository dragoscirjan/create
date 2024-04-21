import { unlink } from "fs/promises";
import { join as pathJoin } from "path";

import writeFile from "@templ-project/create-node/src/util/write-file.js";
import { update as updatePackageJson } from "@templ-project/create-node/src/default/package-json.js";

import readRepoFile from "../util/read-repo-file.js";

/** @param options {{targets: string[],}} */
export default async function (options) {
  const { logger } = options;
  logger.verbose(`configuring tsc...`);

  await updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      "build:code": "tsc -p tsconfig.build.json",
    },
  }));
}
