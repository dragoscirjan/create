import readRepoFile from "../util/read-repo-file.js";

import writeFile from "../util/write-file.js";
import { update as updatePackageJson } from "../default/package-json.js";

/** @param options {{targets: string[],}} */
export default async function (options) {
  const { targets, logger } = options;
  logger.verbose(`configuring babel...`);

  const tsConfig = await readRepoFile("../ts/static/tsconfig.json");
  await writeFile("tsconfig.json", tsConfig, options);

  for (const name of ["base", "browser", "types", "cjs", "esm"]) {
    const tsConfig = await readRepoFile(`../ts/static/tsconfig.${name}.json`);
    await writeFile(`tsconfig.${name}.json`, tsConfig, options);
  }

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...(["browser", "bun", "deno"].map((item) => targets.includes(item)).reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": "tsc -p ./tsconfig.browser.json",
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
      ...(targets.includes("browser") ? { "build:node-cjs": "tsc -p ./tsconfig.cjs.json" } : {}),
      ...(targets.includes("browser") ? { "build:node-esm": "tsc -p ./tsconfig.esm.json" } : {}),
      "build:types": "tsc -p ./tsconfig.types.json",
    },
  }));
}
