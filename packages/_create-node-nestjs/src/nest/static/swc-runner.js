const { spawn } = require("child_process");
const { mkdirSync, writeFileSync, unlinkSync } = require("fs");
const { dirname, join: pathJoin, relative } = require("path");
const { platform } = require("os");

// generate temporary .swcrc file
const generateSwcrc = () => {
  const config = {
    module: {
      type: "commonjs",
    },
    jsc: {
      target: "es2021",
      parser: {
        syntax: "typescript",
        decorators: true,
        dynamicImport: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
        useDefineForClassFields: false,
      },
      keepClassNames: true,
      // baseUrl: tsOptions?.baseUrl,
      // paths: tsOptions?.paths,
    },
    minify: false,
    swcrc: true,
  };
  writeFileSync(".swcrc", JSON.stringify(config, null, 2));
};

const outputDir = `dist`;

const spawnSwc = async (file, outFile) =>
  new Promise((resolve, reject) => {
    const proc = spawn(
      pathJoin(
        __dirname,
        "..",
        "node_modules",
        ".bin",
        `swc${platform() !== "win32" ? "" : ".cmd"}`,
      ),
      [file, "-o", outFile],
      {
        stdio: "inherit",
      },
    );

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`SWC failed for ${file} with exit code ${code}`));
      }
    });
  });

const build = async (file) => {
  // Calculate output path
  const outFile = pathJoin(
    outputDir,
    relative("src", file.replace(/\.ts$/, ".js")),
  );
  const outDir = dirname(outFile);

  // Ensure the directory exists
  console.log(`Compiling ${file} to ${outFile}`);
  mkdirSync(outDir, { recursive: true });
  return spawnSwc(file, outFile).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
};

(async () => {
  generateSwcrc();

  await import("globby")
    .then(({ globby }) => globby(["src/**/*.ts"]))
    .then((files) =>
      files.filter(
        (file) => !file.endsWith(".test.js") && !file.endsWith(".spec.js"),
      ),
    )
    .then((files) => files.map(build))
    .then((promises) => Promise.all(promises));

  unlinkSync(".swcrc");
})();
