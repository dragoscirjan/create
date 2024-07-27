import {
  AvailableBundlers,
  AvailableFormatters,
  AvailableLanguages,
  AvailableLinters,
  AvailablePackageManagers,
  AvailableTargets,
  AvailableTestFrameworks,
  AvailableTranspilers,
  AvailableQualityTools,
} from "@templ-project/core";
import { Command } from "commander";
import { ProgramOptions } from "./options.js";

const program = new Command();

program
  .argument("<projectPath>", "Project Path")
  .option(
    "-l, --language <string>",
    `Programming Language to use: ${Object.values(AvailableLanguages).join(", ")}`,
    Object.values(AvailableLanguages).shift(),
  )
  .option(
    "-t, --target <string...>",
    `Module's target: ${Object.values(AvailableTargets).join(", ")}`,
    Object.values(AvailableTargets).shift(),
  )
  .option(
    "--package-manager <packageManger>",
    `Package Manager to use: ${Object.values(AvailablePackageManagers).join(", ")}`,
    Object.values(AvailablePackageManagers).shift(),
  )
  .option(
    "--test-framework <testFramework>",
    `Testing Framework to use: ${Object.values(AvailableTestFrameworks).join(", ")}`,
    Object.values(AvailableTestFrameworks).shift(),
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
  // TODO: implement later; focus on @templ-project/code-analysis
  // .option(
  //   "--quality-handler <string>",
  //   `(Quality Tools) Handler to use: ${Object.values(AvailableQualityHandlers).join(", ")}`,
  //   Object.values(AvailableQualityHandlers).shift(),
  // )
  .option(
    "--formatter <string>",
    `(Quality Tools) Formatter to use: ${Object.values(AvailableFormatters).join(", ")}`,
    Object.values(AvailableFormatters).shift(),
  )
  .option(
    "--linter <string>",
    `(Quality Tools) Linter to use: ${Object.values(AvailableLinters).join(", ")}`,
    Object.values(AvailableLinters).shift(),
  )
  .option(
    "--quality-tool <string...>",
    `Quality Tools to use: ${Object.values(AvailableQualityTools).join(", ")}`,
    Object.values(AvailableQualityTools).shift(),
  )
  .option("-i, --interactive", "Interactive mode")
  .option("-q, --quiet", "Suppress all output except for warnings and errors")
  .option("-v, --verbose", "Increase logging level")
  .action(async (projectPath: string, options: ProgramOptions) => {
    await import(`./runner/${options.language}.js`).then(
      ({ default: runner }) => runner(projectPath, options),
    );
  });

export default program;
