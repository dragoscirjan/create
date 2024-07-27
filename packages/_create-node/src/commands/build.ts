import run from "../run.js";
import { BuildCommandOptions } from "../types.js";

export default async function (options: BuildCommandOptions) {
  const { language, buildTool } = options;

  const runners = ["build/clean", `build/${buildTool}`];

  for (const runner of runners) {
    await run(language as string, runner, options);
  }
}
