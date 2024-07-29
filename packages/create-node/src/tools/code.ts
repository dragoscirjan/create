import { mkdir, writeFile } from "fs/promises";
import { ProgramOptions } from "../options.js";
import path from "path";
import { AvailableLanguages } from "@templ-project/core";

const codeSetup = async (projectPath: string, options: ProgramOptions) => {
  await mkdir(path.join(projectPath, "src"), { recursive: true });

  return writeFile(
    path.join(projectPath, "src", `index.${options.language}`),
    code[options.language],
  );
};

export default codeSetup;

export const code = {
  ["AvailableLanguages.Coffee"]: /*coffee*/ `export hello = (who) ->
  "Hello, #{who}!"

export writeHello = (who) ->
  console.log hello(who)

`,
  [AvailableLanguages.Js]: /*js-*/ `export const hello = (who) => \`Hello, \${who}!\`;

export const writeHello = (who) => console.log(hello(who));

`,
  [AvailableLanguages.Ts]: /*ts-*/ `export const hello = (who: string): string => \`Hello, \${who}!\`;

export const writeHello = (who: string): void => console.log(hello(who));

`,
};
