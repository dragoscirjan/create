import jasmine from "../../default/test-framework/jasmine.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  return jasmine(options);
}
