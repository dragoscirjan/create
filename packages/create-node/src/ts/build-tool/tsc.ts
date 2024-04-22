import readRepoFile from "../../util/read-repo-file";

import writeFile from "../../util/write-file";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../../default/create/package-json";
import { CreateCommandOptions, BuildTarget } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { testFramework, targets, logger } = options;
  logger?.verbose(`configuring babel...`);

  const tsConfig = await readRepoFile("../ts/static/tsconfig.json", options);
  let tsConfigObject = JSON.parse(tsConfig);
  if (["jest", "mocha"].includes(testFramework)) {
    tsConfigObject = {
      ...tsConfigObject,
      compilerOptions: {
        ...(tsConfigObject?.compilerOptions ?? {}),
        types: [
          ...(tsConfigObject?.compilerOptions?.types ?? []),
          testFramework,
        ],
      },
    };
  }
  await writeFile(
    "tsconfig.json",
    JSON.stringify(tsConfigObject, null, 2),
    options
  );

  for (const name of ["base", "browser", "types", "cjs", "esm"]) {
    await readRepoFile(`../ts/static/tsconfig.${name}.json`, options).then(
      (tsConfig) => writeFile(`tsconfig.${name}.json`, tsConfig, options)
    );
  }

  return updatePackageJson(options, (packageObject: PackageJsonOptions) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...((["browser", "bun", "deno"] as BuildTarget[])
        .map((item: BuildTarget) => targets?.includes(item))
        .reduce((acc, cur) => acc || cur, false)
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
      ...(targets?.includes("browser")
        ? { "build:node-cjs": "tsc -p ./tsconfig.cjs.json" }
        : {}),
      ...(targets?.includes("browser")
        ? { "build:node-esm": "tsc -p ./tsconfig.esm.json" }
        : {}),
      "build:types": "tsc -p ./tsconfig.types.json",
    },
  }));
}
