import mocha, { mochaConfig } from "../../default/test-framework/mocha.js";
import { CreateCommandOptions } from "../../types.js";

export default async function (options: CreateCommandOptions) {
  const { language } = options;
  const config = mochaConfig(language!);

  return mocha(options, {
    ...config,
    require: ["@babel/register", ...config.require],
  });
}
