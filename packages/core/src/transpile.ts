import babel, { NodePath } from "@babel/core";
import { AvailableLanguages } from "./options.js";

/**
 *
 */
const moduleExportsPlugin = () => {
  return {
    visitor: {
      AssignmentExpression(path: NodePath<any>) {
        const { left, operator, right } = path.node;
        if (operator === "=" && left.object && left.object.name === "exports") {
          if (path.parentPath !== null) {
            path.replaceWith(path.parentPath.scope.buildUndefinedNode());
            if (right.name || right.value) {
              path.parentPath.replaceWithSourceString(
                `module.exports = ${right.name || right.value}`,
              );
            } else {
              path.parentPath.remove();
            }
          }
        }
      },
    },
  };
};

export type BabelTranspileMode = "strip" | "cjs" | "esm";

export const transpileTsToJs = (
  code: string,
  mode: BabelTranspileMode = "strip",
): string => {
  const plugins = [
    ["@babel/plugin-transform-typescript"],
    ...(mode === "cjs"
      ? [["@babel/plugin-transform-modules-commonjs", { strict: true }]]
      : []),
    ...(mode === "cjs" ? [moduleExportsPlugin] : []),
  ];
  const presets = [
    "@babel/preset-typescript",
    ...(mode === "cjs"
      ? [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "current",
              },
            },
          ],
        ]
      : []),
  ];

  const output = babel.transformSync(code, {
    presets,
    plugins,
    filename: "file.ts",
    configFile: false,
    sourceType: "module",
  });

  if (!output || !output.code) {
    throw new Error(`transpileToJs could not convert code: ${code}`);
  }

  if (mode === "esm") {
    // Ensure ESM imports have correct file extensions
    const esmCode = output.code.replace(/from '([^']+)'/g, (match, p1) => {
      if (!p1.endsWith(".js")) {
        return `from '${p1}.js'`;
      }
      return match;
    });
    return esmCode;
  }

  return output.code;
};

export const transpileTs = (
  language: AvailableLanguages,
  code: string,
  options: {
    mode?: BabelTranspileMode;
  },
): string => {
  if (language === AvailableLanguages.Js) {
    return transpileTsToJs(code, options.mode ?? "strip");
  }
  // TODO: there should be a ts to coffee transpiler as well, however it's implementation is quite complicated for now
  return code;
};
