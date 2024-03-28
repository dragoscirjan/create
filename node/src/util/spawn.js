import { spawn } from "child_process";

/**
 * @param command string[]
 * @param options {{cwd?: string}}
 */
export default async function (command, options = {}) {
  console.log(`Executing '${command.join(" ")}' with options '${JSON.stringify(options)}'`);

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
        reject(new Error(`'${command.join(" ")}' exited with code ${code}.Error: ${stderr} `));
      }
    });
  });
}
