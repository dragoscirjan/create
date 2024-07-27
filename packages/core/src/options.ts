export enum AvailableLanguages {
  Ts = "ts",
  Js = "js",
  // Coffee = "coffee",
}

export enum AvailablePackageManagers {
  Npm = "npm",
  Pnpm = "pnpm",
  Yarn = "yarn",
  Bun = "bun",
}

export enum AvailableTargets {
  All = "all",
  Esm = "esm",
  Cjs = "cjs",
  Bun = "bun",
  Browser = "browser",
  Deno = "deno",
  // not interested in cloudflare
}

///////////////////////////////////////////////////////////////////////////////

// https://github.com/JohnDeved/awesome-typescript-compilers
// https://daily.dev/blog/typescript-transpiler-tools-comparison
export enum AvailableTranspilers {
  Tsc = "tsc",
  Babel = "babel", // https://babeljs.io/
  Esbuild = "esbuild", // https://esbuild.github.io/
  // Oxc = "oxc", // TODO
  // Sucrase = "sucrase", // TODO https://sucrase.io/
  Swc = "swc", // https://swc.rs/
}

export enum AvailableTranspilerHandlers {
  Templ = "templ",
  Native = "native",
}

// https://snipcart.com/blog/javascript-module-bundler
// https://turbo.build/pack
// https://makojs.dev/
export enum AvailableBundlers {
  Esbuild = "esbuild", // https://esbuild.github.io/
  // Mako = "mako", // TODO: https://makojs.dev/
  Rollup = "rollup", // https://rollupjs.org/
  // Rolldown = "rolldown", // TODO https://rolldown.rs/
  // Turbo = "turbo", // TODO https://turbo.build/
}

///////////////////////////////////////////////////////////////////////////////

export enum AvailableTestFrameworks {
  Vitest = "vitest", // https://vitest.js.org/
  // Ava = "ava", // TODO https://github.com/avajs/ava
  Jest = "jest", // https://jestjs.io/
  // Mocha = "mocha", // TODO https://mochajs.org/
}

///////////////////////////////////////////////////////////////////////////////

export enum AvailableQualityHandlers {
  Templ = "templs",
  LintStaged = "lint-staged",
}

export enum AvailableQualityTools {
  All = "all",
  Jscpd = "jscpd", // https://jscpd.org/
  Audit = "audit", // ...
  Snyk = "snyk", // https://snyk.org/
  DependencyCruiser = "dependency-cruiser", // https://github.com/sverweij/dependency-cruiser
  Sonar = "sonar", // https://sonarqube.org/
  Depcheck = "depcheck", // https://github.com/depcheck/depcheck https://github.com/depcheck/depcheck
  LicenseChecker = "license-checker", // https://github.com/davglass/license-checker
}

// TODO

export enum AvailableLinters {
  Eslint = "eslint", // https://eslint.org - using eslint 8 - legacy
  // Eslint9 = "eslint9", // TODO: https://eslint.org/ - using eslint 9 - experimental
  Oxlint = "oxlint", // https://oxc.rs/
  // Stylelint = "stylelint", // TODO: https://stylelint.io/
}

export enum AvailableFormatters {
  Prettier = "prettier", // https://prettier.io/
  Biome = "biome", // https://biomejs.dev/
  // Oxc = "oxc", // TODO:
}
