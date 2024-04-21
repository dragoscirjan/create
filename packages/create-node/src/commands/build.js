import run from "../run.js";

export { allBuildTools } from "./default.js";

/**
 * @param projectPath {string}
 * @param options {{
      buildTool: 'babel' | 'tsc' | 'rollup' | 'esbuild' | 'swc',
      logger: any,
      projectPath: string,
      language: 'js' | 'ts' | 'coffee',
      targets: ('browser' | 'bun' | 'deno' | 'node-csj' | 'node-esm')[],
    }}
 */
export default async function (_projectPath, options) {
  const { language, buildTool } = options;

  const runners = [`build/clean`, `build/${buildTool}`];
  for (const runner of runners) {
    await run(language, runner, options);
  }
}
