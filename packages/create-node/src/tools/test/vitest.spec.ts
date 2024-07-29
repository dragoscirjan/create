import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile } from "fs/promises";
import path from "path";
import PackageJson from "@npmcli/package-json";
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
  logger,
} from "@templ-project/core";
import { installDevDependencies } from "@templ-project/core";
import vitestSetup from "./vitest.js";
import { ProgramOptions } from "../../options.js";
import testSetup from "./default.js";
import { vitestConfig, vitestSpecCode, vitestTestCode } from "./vitest.js";

// Mock functions
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("@npmcli/package-json", () => {
  class MockPackageJson {
    public content = {
      scripts: {},
    };
    public load = vi.fn().mockResolvedValue(this);
    public update = vi.fn().mockReturnThis();
    public save = vi.fn().mockResolvedValue(this);
  }

  return { default: MockPackageJson };
});

vi.mock("@templ-project/core", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@templ-project/core")>();
  return {
    ...mod,
    installDevDependencies: vi.fn(),
    logger: {
      debug: vi.fn(),
    },
  };
});

vi.mock("./default.js", () => ({
  default: vi.fn(),
}));

const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;
const mockedInstallDevDependencies =
  installDevDependencies as unknown as ReturnType<typeof vi.fn>;
const mockedLogger = logger.debug as unknown as ReturnType<typeof vi.fn>;
const mockedPackageJson = PackageJson as unknown as ReturnType<typeof vi.fn>;
const mockedTestSetup = testSetup as unknown as ReturnType<typeof vi.fn>;

describe("vitestSetup", () => {
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
    mockedWriteFile.mockClear();
    mockedInstallDevDependencies.mockClear();
    mockedLogger.mockClear();
    mockedTestSetup.mockClear();

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call testSetup with correct arguments", async () => {
    await vitestSetup(projectPath, options);
    expect(mockedTestSetup).toHaveBeenCalledWith(projectPath, options);
  });

  it("should call installDevDependencies with correct arguments", async () => {
    await vitestSetup(projectPath, options);
    expect(mockedInstallDevDependencies).toHaveBeenCalledWith(
      options.packageManager,
      ["typescript", "ts-node", "vitest"],
      { cwd: projectPath },
    );
  });

  it("should call writeFile to create vitest.setup.js", async () => {
    await vitestSetup(projectPath, options);
    const configPath = path.join(projectPath, "vitest.setup.js");
    expect(mockedWriteFile).toHaveBeenCalledWith(configPath, vitestConfig);
  });

  // it("should update package.json with test script", async () => {
  //   await vitestSetup(projectPath, options);
  //   expect(mockedPackageJson).toHaveBeenCalled();

  //   const mockedPackageJsonInstance = new mockedPackageJson();
  //   expect(mockedPackageJsonInstance.load).toHaveBeenCalledWith(projectPath);
  //   expect(mockedPackageJsonInstance.update).toHaveBeenCalledWith({
  //     scripts: expect.objectContaining({
  //       test: "cross-env NODE_ENV=test vitest run",
  //     }),
  //   });
  //   expect(mockedPackageJsonInstance.save).toHaveBeenCalled();
  // });

  it("should call writeFile to create index.spec.ts and index.test.ts", async () => {
    await vitestSetup(projectPath, options);
    const specFilePath = path.join(projectPath, "src", "index.spec.ts");
    const testFilePath = path.join(projectPath, "test", "index.test.ts");
    expect(mockedWriteFile).toHaveBeenCalledWith(
      specFilePath,
      vitestSpecCode.ts,
    );
    expect(mockedWriteFile).toHaveBeenCalledWith(
      testFilePath,
      vitestTestCode.ts,
    );
  });

  it("should log debug messages", async () => {
    await vitestSetup(projectPath, options);
    expect(mockedLogger).toHaveBeenCalledWith("Setting up `vitest`...");
    expect(mockedLogger).toHaveBeenCalledWith("`vitest`setup completed...");
  });
});
