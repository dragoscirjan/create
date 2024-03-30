import mocha, { mochaConfig } from "../default/mocha.js";

export default async function (options) {
  const { language } = options;
  const config = mochaConfig(language);

  return mocha(options, {
    ...config,
    require: ["@babel/register", ...config.require],
  });
}
