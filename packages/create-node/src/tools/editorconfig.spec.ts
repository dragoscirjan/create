import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile } from "fs/promises";
import path from "path";
import { logger } from "@templ-project/core";
import editorConfigSetup, { editorConfigConfig } from "./editorconfig.js";
import { ProgramOptions } from "../options.js";

// Mock writeFile and logger
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

vi.mock("@templ-project/core", () => ({
  logger: {
    debug: vi.fn(),
  },
}));

const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;
const mockedLogger = logger.debug as unknown as ReturnType<typeof vi.fn>;

describe("editorConfigSetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = { packageManager: "npm" };

  beforeEach(() => {
    mockedWriteFile.mockClear();
    mockedLogger.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call writeFile with correct arguments", async () => {
    await editorConfigSetup(projectPath, options);

    const editorConfigPath = path.join(projectPath, ".editorconfig");

    expect(mockedWriteFile).toHaveBeenCalledWith(
      editorConfigPath,
      editorConfigConfig,
    );
  });

  it("should log debug messages", async () => {
    await editorConfigSetup(projectPath, options);

    expect(mockedLogger).toHaveBeenCalledWith("Setting up `.editorconfig`");
    expect(mockedLogger).toHaveBeenCalledWith(
      "`.editorconfig` setup completed",
    );
  });
});
