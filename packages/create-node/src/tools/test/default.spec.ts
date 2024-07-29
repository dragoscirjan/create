import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdir } from "fs/promises";
import path from "path";
import {
  AvailableBundlers,
  AvailableFormatters,
  AvailableLanguages,
  AvailableLinters,
  AvailablePackageManagers,
  AvailableQualityTools,
  AvailableTargets,
  AvailableTestFrameworks,
  AvailableTranspilers,
  installDevDependencies,
} from "@templ-project/core";
import testSetup from "./default.js";
import { ProgramOptions } from "../../options.js";

// Mock mkdir and installDevDependencies
vi.mock("fs/promises", () => ({
  mkdir: vi.fn(),
}));

vi.mock("@templ-project/core", () => ({
  installDevDependencies: vi.fn(),
}));

const mockedMkdir = mkdir as unknown as ReturnType<typeof vi.fn>;
const mockedInstallDevDependencies =
  installDevDependencies as unknown as ReturnType<typeof vi.fn>;

describe("testSetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = {
    packageManager: AvailablePackageManagers.Npm,
    language: AvailableLanguages.Ts,
    target: [AvailableTargets.Cjs],
    testFramework: AvailableTestFrameworks.Vitest,
    transpiler: AvailableTranspilers.Tsc,
    bundler: AvailableBundlers.Esbuild,
    formatter: AvailableFormatters.Prettier,
    linter: AvailableLinters.Eslint,
    qualityTool: [AvailableQualityTools.DependencyCruiser],
  };

  beforeEach(() => {
    mockedMkdir.mockClear();
    mockedInstallDevDependencies.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call mkdir to create src directory", async () => {
    await testSetup(projectPath, options);

    const srcPath = path.join(projectPath, "src");

    expect(mockedMkdir).toHaveBeenCalledWith(srcPath, { recursive: true });
  });

  it("should call mkdir to create test directory", async () => {
    await testSetup(projectPath, options);

    const testPath = path.join(projectPath, "test");

    expect(mockedMkdir).toHaveBeenCalledWith(testPath, { recursive: true });
  });

  it("should call installDevDependencies with correct arguments", async () => {
    await testSetup(projectPath, options);

    expect(mockedInstallDevDependencies).toHaveBeenCalledWith(
      options.packageManager,
      ["cross-env"],
      { cwd: projectPath },
    );
  });
});
