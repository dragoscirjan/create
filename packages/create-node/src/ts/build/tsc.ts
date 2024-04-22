import { join as joinPath } from "path";
import { CreateCommandOptions } from "../../types";

async function runTsc(
  format: string,
  options: CreateCommandOptions
): Promise<void> {
  const { logger, projectPath } = options;

  const { default: ts } = await import("typescript");
  const tsconfigPath = joinPath(projectPath!, `tsconfig.${format}.json`);
  let { options: compilerOptions } = ts.getParsedCommandLineOfConfigFile(
    tsconfigPath,
    {},
    ts.sys
  );

  compilerOptions = {
    ...compilerOptions,
    baseUrl: compilerOptions.baseUrl ?? "./",
    paths: compilerOptions.paths ?? {},
  };

  const { default: tsconfigPaths } = await import("tsconfig-paths");
  tsconfigPaths.register({
    baseUrl: compilerOptions.baseUrl,
    paths: compilerOptions.paths,
  });

  process.argv = process.argv.slice(0, 1); // tsc read the arguments so we need to clear them
  const { default: tsc } = await import("typescript/lib/tsc.js");
  console.log("test", tsc);
  // const commandLine = tsc.parseCommandLine([], ts.sys);
  // const host = tsc.createSolutionBuilderHost(ts.sys, logger);
  // const builder = tsc.createSolutionBuilder(host, [commandLine.options], {
  //   dry: false,
  //   force: false,
  //   verbose: false,
  // });

  // const result = builder.build();
  // if (result === tsc.ExitStatus.Success) {
  //   logger.info("tsc: success");
  // } else {
  //   logger.error("tsc: failed");
  // }
}

/**
 * @param projectPath {string}
 * @param options {{
      buildTool: 'babel' | 'tsc' | 'rollup' | 'esbuild' | 'swc',
      logger: any
    }}
 */
export default async function (options) {
  const { logger } = options;

  await runTsc("cjs", options);
}
