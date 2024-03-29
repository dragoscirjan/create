import { mkdir, readFile, writeFile } from "fs/promises";
import { join as joinPath } from "path";

/** @param options {{packageManager: 'npm' | 'pnpm' | 'yarn', projectPath: string}} */
export default async function (options) {
  const { projectPath } = options;

  console.log(`Creating folder: ${projectPath}`);
  await mkdir(projectPath, { recursive: true });

  if (!process.env.SKIP_NPM_INIT) {
    const binary = await import(`../util/package-manager/${options.packageManager}.js`);
    await binary.init(options);
  }
}

/** @param options {{projectPath: string}} */
export async function read(options) {
  const { projectPath } = options;

  return await readFile(joinPath(projectPath, "package.json"), "utf-8").then((buffer) =>
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
  let object = await read(options);

  if (typeof callback === "function") {
    object = callback(object);
  } else {
    if (typeof callback === "object") {
      object = {
        ...object,
        ...callback,
      };
    }
  }

  return write(options, object);
}

/** @param commmand {string} */
export function appendRunS(command, script) {
  return [...new Set(["run-s", ...(command || "run-s").split(" ").slice(1), script])].join(" ");
}

/** @param commmand {string} */
export function appendRunP(command, script) {
  return [...new Set(["run-p", ...(command || "run-p").split(" ").slice(1), script])].join(" ");
}
