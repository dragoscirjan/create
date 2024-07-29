import {
  AvailableBundlers,
  AvailableTargets,
  AvailableTranspilers,
} from "@templ-project/core";
import { Command } from "commander";

import os from "os";
import { ProgramInitOptions, ProgramOptions } from "./options.js";

const program = new Command();
const defaultConcurrent: number = os.cpus().length / 2;

program
  .argument("<projectFiles>", "Project Files")
  .option("--config [string]", "Path to configuration file");

codeBuildGenericOptions(program)
  .option(
    "-p, --concurrent [number]",
    `The number of tasks to run concurrently, set 1 for serial (default: ${defaultConcurrent} | 0.5 * CPU cores)`,
    `${defaultConcurrent}`,
  )
  .option("-w, --watch", `Watch mode`)
  .option("-q, --quiet", "Suppress all output except for warnings and errors")
  .option("-i, --interactive", "Interactive mode")
  .action(async (projectPath: string, options: ProgramOptions) => {
    console.log(projectPath, options);
  });

const initCommand = program
  .command("init")
  .argument("<projectPath>", "Project Path");

codeBuildInitOptions(initCommand).action(
  (projectPath: string, options: ProgramInitOptions) => {
    console.log(projectPath, options);
  },
);

export default program;

export function codeBuildInitOptions(program: Command): Command {
  return codeBuildGenericOptions(program).option(
    "-n, --native-commands",
    `Use native commands and completely ignore the '@templ-project/code-build' module`,
  );
}

export function codeBuildGenericOptions(program: Command): Command {
  return (
    program

      .option(
        "-t, --target <string...>",
        `Module's target: ${Object.values(AvailableTargets).join(", ")}`,
        Object.values(AvailableTargets).shift(),
      )
      .option(
        "--transpiler <string>",
        `(Transpiler) Transpiler to use: ${Object.values(AvailableTranspilers).join(", ")}`,
        Object.values(AvailableTranspilers).shift(),
      )
      // TODO: implement later; focus on @templ-project/code-build
      // .option(
      //   "--transpiler-handler <string>",
      //   `(Transpiler) Handler to use: ${Object.values(AvailableTranspilerHandlers).join(", ")}`,
      //   Object.values(AvailableTranspilerHandlers).shift(),
      // )
      .option(
        "--bundler <string>",
        `For 'browser' target, bunlder to use: ${Object.values(AvailableBundlers).join(", ")}`,
        Object.values(AvailableBundlers).shift(),
      )
  );
  // TODO: implement later; focus on @templ-project/code-analysis
  // .option(
  //   "--quality-handler <string>",
  //   `(Quality Tools) Handler to use: ${Object.values(AvailableQualityHandlers).join(", ")}`,
  //   Object.values(AvailableQualityHandlers).shift(),
  // );
}
