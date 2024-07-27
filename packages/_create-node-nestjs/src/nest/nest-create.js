import { getModulePath } from "@templ-project/create-node/src/util/which.js";
import { basename, dirname, relative, join as pathJoin } from "path";
import spawn from "@templ-project/create-node/src/util/spawn.js";
import { unlink } from "fs/promises";

/**
 * @param options {{
      language: 'js' | 'ts',
      packageManager: 'npm' | 'pnpm' | 'yarn',
      targets: string[],
      qualityTools: string[],
      projectPath: string
      logger: any
    }}
 */
export default async function (options) {
  const { projectPath, language, packageManager, logger } = options;

  logger.info("Creating project using @nestjs/cli...");

  const binaryPath = await getModulePath("@nestjs/cli").then((p) =>
    pathJoin(p, "..", "..", ".bin", "nest"),
  );
  await spawn(
    [basename(projectPath) ? basename(projectPath) : ""],
    { cwd: process.cwd(), stdio: "inherit" },
  );

  await unlink(pathJoin(projectPath, ".prettierrc"));
}
