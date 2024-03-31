import readRepoFile from "../util/read-repo-file.js";

import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "../default/package-json.js";

/** @param options {{targets: string[],}} */
export default async function (options) {
  const { targets, logger } = options;
  logger.verbose(`configuring babel...`);

  const babelConfig = await readRepoFile("../default/static/.babelrc.js");
  await writeFile(".babelrc.js", babelConfig, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...(["browser", "bun", "deno"].map((item) => targets.includes(item)).reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": 'cross-env BUILD_ENV=browser babel src --out-dir dist/browser --extensions ".js"',
            "build:browser-bundle":
              "esbuild --bundle dist/browser/index.js --format=esm --target=es2020 --outfile=dist/browser/index.bundle.js",
            "build:browser-bundle-min":
              "esbuild --minify --bundle dist/browser/index.js --format=esm --target=es2020 --outfile=dist/browser/index.bundle.min.js",
            "build:browser-umd":
              'rollup dist/browser/index.bundle.js --format umd --name "@templ-project/node-typescript" -o dist/browser/index.umd.js',
            "build:browser-umd-min":
              'rollup dist/browser/index.bundle.min.js --compact --format umd --name "@templ-project/node-typescript" -o dist/browser/index.umd.min.js',
          }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-cjs": 'cross-env BUILD_ENV=node-cjs babel src --out-dir dist/node-cjs --extensions ".js"' }
        : {}),
      ...(targets.includes("browser")
        ? { "build:node-esm": 'cross-env BUILD_ENV=node-esm babel src --out-dir dist/node-esm --extensions ".js"' }
        : {}),
    },
  }));
}
