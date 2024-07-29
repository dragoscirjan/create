import {
  AvailableFormatters,
  AvailableLanguages,
  AvailableLinters,
  AvailablePackageManagers,
  AvailableTestFrameworks,
  AvailableQualityTools,
} from "@templ-project/core";
import { Command } from "commander";
import { ProgramOptions } from "./options.js";
import { codeBuildInitOptions } from "@templ-project/code-build";
import create from "./create-action.js";

const program = new Command();

program
  .argument("<projectPath>", "Project Path")
  .option(
    "-l, --language <string>",
    `Programming Language to use: ${Object.values(AvailableLanguages).join(", ")}`,
    Object.values(AvailableLanguages).shift(),
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
  );

codeBuildInitOptions(program)
  // codeAnalysisInitOptions(program)
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
  .option("-q, --quiet", "Suppress all output except for warnings and errors")
  .option("-i, --interactive", "Interactive mode")
  .action(async (projectPath: string, options: ProgramOptions) =>
    create(projectPath, options),
  );

export default program;
