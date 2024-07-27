import { installDevDependencies, logger } from "@templ-project/core";
import { writeFile } from "fs/promises";
import path from "path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import commitLintSetup, { commitLintConfig } from "./commitlint";

import { ProgramOptions } from "../options.js";

// Mock writeFile and installDevDependencies
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("@templ-project/core", () => ({
  installDevDependencies: vi.fn(),
  logger: {
    debug: vi.fn(),
  },
}));

const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;
const mockedInstallDevDependencies =
  installDevDependencies as unknown as ReturnType<typeof vi.fn>;
const mockedLogger = logger.debug as unknown as ReturnType<typeof vi.fn>;

describe("commitLintSetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = { packageManager: "npm" };

  beforeEach(() => {
    mockedWriteFile.mockClear();
    mockedInstallDevDependencies.mockClear();
    mockedLogger.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call installDevDependencies with correct arguments", async () => {
    await commitLintSetup(projectPath, options);

    expect(mockedInstallDevDependencies).toHaveBeenCalledWith(
      options.packageManager,
      ["@commitlint/cli", "@commitlint/config-conventional"],
      { cwd: projectPath },
    );
  });

  it("should call writeFile to create .commitlinkrc.js", async () => {
    await commitLintSetup(projectPath, options);

    expect(mockedWriteFile).toHaveBeenCalledWith(
      path.join(projectPath, ".commitlinkrc.js"),
      commitLintConfig,
    );
  });

  it("should log debug messages", async () => {
    await commitLintSetup(projectPath, options);

    expect(mockedLogger).toHaveBeenCalledWith("Setting up `commitlint`...");
    expect(mockedLogger).toHaveBeenCalledWith("`commitlint`setup completed...");
  });
});
