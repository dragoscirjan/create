import readRepoFile from "../util/read-repo-file.js";

import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "./package-json.js";

export default async function (options) {
  const { logger } = options;
  logger.info("cpdating package.json for Node.Js ESM build...");

  await updatePackageJson(options, (object) => ({
    ...object,
    exports: {
      ...(object.exports || {}),
      ".": {
        ...(object.exports?.["."] || {}),
        import: "./dist/node/node-esm/index.js",
      },
    },
    scripts: {
      ...object.scripts,
      "build:node-esm":
        object.scripts?.["build:node-esm"]?.replace(/\s?&& node .scripts\/esm-module.js/gi, "") +
        " && node .scripts/esm-module.js",
    },
  }));

  const esmComplete = await readRepoFile("../default/static/esm-module.js");
  return writeFile(".scripts/esm-module.js", esmComplete, options);
}
