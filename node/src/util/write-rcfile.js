import writeFile from "./write-file.js";

export default async function (file, config, options) {
  return writeFile(file, `module.exports = ${JSON.stringify(config)}`, options);
}
