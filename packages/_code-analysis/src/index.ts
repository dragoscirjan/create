import os from "os";
import { Command } from "commander";
import chalk from "chalk";

import { ExecaError, Result } from "execa";
import { CAConfigOptions, CAListrContext, ProgramOptions } from "./options.js";
import { loadConfig } from "./config.js";
import { runAll } from "./run-all.js";
import init from "./init.js";

const program = new Command();
const markLine = Array.from({ length: 80 }, () => "-").join("");

const defaultConcurrent: number = os.cpus().length / 2;

program
  .description("Run Code Analysis on the Code")
  // TODO: maybe later
  // .option("--init", "Initialize Code Analysis Config")
  .option("--config [string]", "Path to configuration file")
  .option(
    "-p, --concurrent [number]",
    `the number of tasks to run concurrently, set 1 for serial (default: ${defaultConcurrent} | 0.5 * CPU cores)`,
    `${defaultConcurrent}`,
  )
  .option("-q, --quiet", "Suppress all output except for warnings and errors")
  .option("-v, --verbose", "Increase logging level")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async (options: ProgramOptions) => {
    // if (options.init) {
    //   await init();
    //   return;
    // }
    let config: CAConfigOptions;
    try {
      config = await loadConfig(options.config);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      const ctx = await runAll(config, options);
      Object.entries((ctx as CAListrContext).results ?? {}).forEach(
        ([command, result]) => {
          console.log("");
          console.log(markLine);
          console.log(command);
          console.log(markLine);
          console.log((result as Result).stdout);
        },
      );
      // console.log(ctx);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err instanceof ExecaError) {
        console.error(chalk.red(markLine));
        console.error(chalk.red(err.shortMessage));
        console.error(chalk.red(markLine));
        console.error(err.stdout);

        process.exit(err.exitCode);
      }

      console.error(err);
    }
  });

export default program;
