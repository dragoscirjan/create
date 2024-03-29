import mocha, { mochaConfig } from "../default/mocha.js";

export default async function (options) {
  mochaConfig.require = ["@babel/register", ...mochaConfig.require];

  return mocha(options, mochaConfig);
}
