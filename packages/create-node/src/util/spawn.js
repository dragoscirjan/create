import { spawn } from "child_process";

import logger from "./logger.js";

/**
 * @param command string[]
 * @param options {{cwd?: string}}
 */
export default async function (command, options = {}) {
  logger.debug(`executing '${command.join(" ")}' with options '${JSON.stringify(options)}'`);

  return new Promise((resolve, reject) => {
    const proc = spawn(command[0], command.length > 1 ? command.slice(1) : [], {
      stdio: ["pipe", "pipe", "pipe"],
      ...options,
    });
    let stdout = "";
    let stderr = "";

    if (!options.stdio) {
      proc.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data) => {
        stderr += data.toString();
      });
    }

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        logger.error(`'${command.join(" ")}' exited with code ${code}.`);
        logger.debug(`error: ${stderr}`);
        process.exit(1);
      }
    });
  });
}
