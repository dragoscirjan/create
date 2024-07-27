import { AvailableTranspilers } from "@templ-project/core";
import { Command } from "commander";

import os from "os";

const program = new Command();
const defaultConcurrent: number = os.cpus().length / 2;

program
  .argument("<projectFiles>", "Project Files")
  .option("--config [string]", "Path to configuration file")
  .option(
    "-b, --builder <string>",
    `Transpiler to use: ${Object.values(AvailableTranspilers).join(", ")}`,
    Object.values(AvailableTranspilers).shift(),
  )
  .option(
    "-p, --concurrent [number]",
    `the number of tasks to run concurrently, set 1 for serial (default: ${defaultConcurrent} | 0.5 * CPU cores)`,
    `${defaultConcurrent}`,
  )
  .option("-w, --watch", `Watch mode`)
  .option("-q, --quiet", "Suppress all output except for warnings and errors")
  .option("-v, --verbose", "Increase logging level")
  .action(
    async (
      projectPath: string,
      options: any /*CreateCommandOptions & {
        qualityTools: QualityTool[] | string;
        targets: string[] | string;
      }*/,
    ) => {
      console.log(projectPath, options);
    },
  );

export default program;
