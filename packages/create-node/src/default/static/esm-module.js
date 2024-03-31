const { writeFileSync } = require("fs");
const { join: pathJoin } = require("path");

writeFileSync(pathJoin(__dirname, "..", "dist", "node-esm", "package.json"), JSON.stringify({ type: "module" }));
