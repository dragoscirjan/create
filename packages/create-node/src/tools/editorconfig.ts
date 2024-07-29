import { writeFile } from "fs/promises";
import path from "path";
import { ProgramOptions } from "../options.js";
import { logger } from "@templ-project/core";

export const editorConfigConfig = `root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false`;

const editorConfigSetup = async (
  projectPath: string,
  _options: ProgramOptions,
) => {
  logger.debug("Setting up `.editorconfig`");
  await writeFile(path.join(projectPath, ".editorconfig"), editorConfigConfig);
  logger.debug("`.editorconfig` setup completed");
};

export default editorConfigSetup;
