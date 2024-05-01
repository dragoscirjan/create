import readRepoFile from "../../util/read-repo-file";
import writeFile from "../../util/write-file";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../../default/create/package-json";
import { CreateCommandOptions, BuildTarget } from "../../types";
import { getBuildableTargets } from "../targets";
import { generateBuildCommand } from ".";

export const babelConfig = {
  plugins: ["@babel/plugin-transform-typescript"],
  presets: [["@babel/preset-env"]],
};

export const babelConfigBrowser = {
  ...babelConfig,
  presets: [
    [
      ...babelConfig.presets[0],
      {
        // The value "> 0.25%, not dead, last 2 versions" tells Babel to target browsers used by more than
        // 0.25% of global users, that are not "dead" (browsers without official support or updates for 24
        // months), and the last 2 versions of all browsers. This ensures your JavaScript code is transpiled
        // to be compatible with the vast majority of users' browsers. Adjust this string to fit the specific
        // needs and audience of your project.
        targets: "> 0.25%, not dead, last 2 versions",
        // `useBuildIns` and `corejs` configure Babel to only include polyfills for features
        // used in your code that are missing in the target environment.
        // Will require core-js@3
        useBuiltIns: "usage",
        corejs: 3,
        // Tells Babel not to transform modules - thus preserving import and export statements
        modules: false,
        // Ensures that Babel attempts to transpile all JavaScript features to comply with
        // specified target. This might not be strictly necessary for targeting ES11, but it's
        // a safety net to ensure compatibility.
        forceAllTransforms: true,
      },
    ],
  ],
};

export const babelConfigCjs = {
  ...babelConfig,
  presets: [
    [
      ...babelConfig.presets[0],
      {
        targets: { node: "current" },
        // `useBuildIns` and `corejs` configure Babel to only include polyfills for features
        // used in your code that are missing in the target environment.
        // Will require core-js@3
        useBuiltIns: "usage",
        corejs: 3,
        // Tells Babel to transform ES modules (import/export) into CommonJS
        // (require/module.exports). This is the critical change for making your code compatible
        // with Node.js environments that only support CommonJS module syntax.
        modules: "commonjs",
      },
    ],
  ],
};

export const babelConfigEsm = {
  ...babelConfig,
  presets: [
    [
      ...babelConfig.presets[0],
      {
        targets: { esmodules: true },
        // `useBuildIns` and `corejs` configure Babel to only include polyfills for features
        // used in your code that are missing in the target environment.
        // Will require core-js@3
        useBuiltIns: "usage",
        corejs: 3,
        // Tells Babel not to transform modules - thus preserving import and export statements
        modules: false,
        // Ensures that Babel attempts to transpile all JavaScript features to comply with
        // specified target. This might not be strictly necessary for targeting ES11, but it's
        // a safety net to ensure compatibility.
        forceAllTransforms: true,
      },
    ],
  ],
};

export const getTargetedBabelRcName = (target: BuildTarget) =>
  `.babelrc.${target.replace("node-", "")}.js`;

// "build:browser-bundle":
//   "esbuild --bundle dist/browser/index.js --format=esm --target=es2020 --outfile=dist/browser/index.bundle.js",
// "build:browser-bundle-min":
//   "esbuild --minify --bundle dist/browser/index.js --format=esm --target=es2020 --outfile=dist/browser/index.bundle.min.js",
// "build:browser-umd":
//   'rollup dist/browser/index.bundle.js --format umd --name "@templ-project/node-typescript" -o dist/browser/index.umd.js',
// "build:browser-umd-min":
//   'rollup dist/browser/index.bundle.min.js --compact --format umd --name "@templ-project/node-typescript" -o dist/browser/index.umd.min.js',
const updatePackageJsonScripts =
  ({ targets, useDefaultCommands }: CreateCommandOptions) =>
  (packageObject: PackageJsonOptions) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...getBuildableTargets(targets)
        .map((target: BuildTarget) => ({
          [`build:${target}`]: useDefaultCommands
            ? `babel src --config-file ./.babelrc.${target.replace(
                "node-",
                ""
              )}.js --out-dir dist/${target} --extensions ".js"`
            : generateBuildCommand({
                target,
                buildTool: "babel",
              }),
        }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {}),
    },
  });

export default async function (options: CreateCommandOptions) {
  const { buildTool, logger, targets } = options;
  logger?.verbose(`configuring (js) ${buildTool}...`);

  // TODO: must find a better way to apply this filter
  for (const target of [
    "base",
    ...targets.filter((t) => !["bun", "deno"].includes(t)),
    ...(targets.includes("deno") || targets.includes("bun") ? ["browser"] : []),
  ]) {
    const fileName = getTargetedBabelRcName(target as BuildTarget);
    await readRepoFile(`../../static/${fileName.slice(1)}`, options).then(
      (config) => writeFile(fileName, config, options)
    );
  }

  return updatePackageJson(options, updatePackageJsonScripts(options));
}
