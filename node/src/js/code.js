import code from "../default/code.js";

const jsCode = `export const hello = (who) => \`Hello, \${who}!\`;

export const writeHello = (who) => console.log(hello(who));`;

export default async function (options) {
  return code(options, jsCode);
}
