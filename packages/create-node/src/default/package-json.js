import { readFile, writeFile } from "fs/promises";
import { join as joinPath } from "path";

import { update as updatePackageJson } from "../default/package-json.js";
import { requiresNyc } from "../util/test-framework.js";

const addNycConfigToPackageJson = async (options) =>
  updatePackageJson(options, (object) => ({
    ...object,
    ...(requiresNyc(options.testFramework)
      ? {
          nyc: {
            reporter: ["html", "lcov", "text"],
            exclude: ["test*", "dist", "*.js", ".scripts", "coverage"],
            all: true,
          },
        }
      : {}),
  }));

const runProjectInit = async (options) => {
  const { logger } = options;
  if (!process.env.SKIP_NPM_INIT) {
    logger.verbose(`initializing project...`);
    return import(`../util/package-manager/${options.packageManager}.js`).then((binary) => binary.init(options));
  } else {
    logger.debug(`project init skiped.`);
  }
};

/** @param options {{packageManager: 'npm' | 'pnpm' | 'yarn', projectPath: string}} */
export default async function (options) {
  await runProjectInit(options);
  return addNycConfigToPackageJson(options);
}

/** @param options {{projectPath: string}} */
export async function read(options) {
  const { projectPath } = options;

  return readFile(joinPath(projectPath, "package.json"), "utf-8").then((buffer) =>
    JSON.parse(buffer.toString("utf-8")),
  );
}

/** @param options {{projectPath: string}} */
export async function write(options, object) {
  const { projectPath } = options;

  return writeFile(joinPath(projectPath, "package.json"), JSON.stringify(object, null, 2));
}

/**
 * @param options {{projectPath: string}}
 * @param callable {object | function}
 */
export async function update(options, callback) {
  return read(options)
    .then((object) => ({
      ...(typeof callback === "function"
        ? callback(object)
        : typeof callback === "object"
          ? {
              ...object,
              ...callback,
            }
          : {}),
    }))
    .then((object) => write(options, object));
}

/** @param commmand {string} */
export function appendRunS(command, script) {
  return [...new Set(["run-s", ...(command || "run-s").split(" ").slice(1), script])].join(" ");
}

/** @param commmand {string} */
export function appendRunP(command, script) {
  return [...new Set(["run-p", ...(command || "run-p").split(" ").slice(1), script])].join(" ");
}
