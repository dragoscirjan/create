const esbuild = require("esbuild");

(async () => {
  const babelPlugin = (await import("esbuild-plugin-babel")).default;

  // Use \`process.env.BUILD_ENV\` to set the environment
  const buildEnv = process.env.BUILD_ENV || "node-esm"; // Default to 'node-esm'

  await esbuild
    .build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      outdir: `dist/${buildEnv}`,
      format: buildEnv === "node-cjs" ? "cjs" : "esm",
      sourcemap: true,
    })
    .catch(() => process.exit(1));
})();
