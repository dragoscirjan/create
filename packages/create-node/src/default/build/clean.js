import { join as joinPath } from "path";
import { rimraf } from "rimraf";

/**
 * @param projectPath {string}
 * @param options {{
      buildTool: 'babel' | 'tsc' | 'rollup' | 'esbuild' | 'swc',
      logger: any
    }}
 */
export default async function (_options) {
  await rimraf(joinPath(process.cwd(), "dist"));
}
