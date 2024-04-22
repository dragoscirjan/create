import readRepoFile from "../../util/read-repo-file";

import writeFile from "../../util/write-file";
import { update as updatePackageJson } from "../package-json";

export default async function (options) {
  const { logger } = options;
  logger.info("updating package.json for Node.Js ESM build...");

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
        object.scripts?.["build:node-esm"]?.replace(
          /\s?&& node .scripts\/esm-module.js/gi,
          ""
        ) + " && node .scripts/esm-module.js",
    },
  }));

  await readRepoFile("../default/static/esm-module.js").then((esmComplete) =>
    writeFile(".scripts/esm-module.js", esmComplete, options)
  );
}
