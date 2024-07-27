import { codeTs } from "../constants.js";
import callable from "../default/code.js";
import { CreateCommandOptions } from "../types.js";

export default async function (options: CreateCommandOptions) {
  await callable(options, codeTs);
}
