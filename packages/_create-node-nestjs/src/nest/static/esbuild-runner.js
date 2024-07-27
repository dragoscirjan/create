const esbuild = require("esbuild");

(async () => {
  const babelPlugin = (await import("esbuild-plugin-babel")).default;

  await esbuild
    .build({
      entryPoints: ["src/main.ts"],
      bundle: true,
      outdir: `dist`,
      format: "cjs",
      sourcemap: true,
    })
    .catch(() => process.exit(1));
})();
