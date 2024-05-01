import { BuildCommandOptions } from "../../types";
import {
  buildBabelConfig,
  handleCompiledFile,
  writeEsmPackageJson,
} from "../../default/build/babel";
import globby from "globby";
import { readFile, stat } from "fs/promises";
import * as esbuild from "esbuild";
import { join as joinPath } from "path";

export async function compile(options: BuildCommandOptions) {
  const { logger, projectPath, target } = options;
  let errorCount = 0;
  let fileCount = 0;

  const babelConfig = await buildBabelConfig({ logger, projectPath, target });

  logger?.info("Compiling files...");
  const time = Date.now();

  await globby(joinPath(projectPath, "src", "**", "*.js"))
    .then((files) => files.filter((f) => !f.endsWith(".spec.js")))
    .then(async (files) => {
      for (const file of files) {
        fileCount++;
        logger?.debug(`Compiling .${file.replace(projectPath, "")}`);

        await readFile(file, "utf-8")
          .then((code) =>
            // @see https://esbuild.github.io/api/#transform
            esbuild.transform(code, {
              // @see https://esbuild.github.io/api/#format
              format: target === "node-cjs" ? "cjs" : "esm",
              // @see https://esbuild.github.io/api/#target
              target:
                target !== "browser"
                  ? "es2020,node16"
                  : "es2020,chrome58,edge16,firefox57,safari11",
              // @see https://esbuild.github.io/api/#sourcemap
              sourcemap: true,
              // TODO: should I use babel plugin here?
              // plugins: babelPlugins,
            })
          )
          .then((result) => {
            handleCompiledFile(result?.code, file, {
              logger,
              projectPath,
              target,
            });
            handleCompiledFile(result?.map, `${file}.map`, {
              logger,
              projectPath,
              target,
            });
          })
          .catch((error) => {
            console.error(`${error.reasonCode}: ${error.message}`);
            logger?.warn(
              `Error compiling ${file}:${error.loc.line}:${error.loc.column}`
            );
            errorCount++;
          });
      }
    });

  writeEsmPackageJson(options);

  logger?.info(`Successfully compiled in ${Date.now() - time}ms`);
}

export default async function (options: BuildCommandOptions) {
  await compile(options);
}
