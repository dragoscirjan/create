import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { execa, $ } from "execa";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { installDevDependencies, logger } from "@templ-project/core";
import huskySetup, { commitMsgCommands, preCommitCommands } from "./husky.js";
import { ProgramOptions } from "../options.js";

// Mock execa, $, readFile, writeFile, and installDevDependencies
vi.mock("execa", () => ({
  execa: vi.fn(),
  $: vi.fn(),
}));

vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock("@templ-project/core", () => ({
  installDevDependencies: vi.fn(),
  logger: {
    debug: vi.fn(),
  },
}));

const mockedExeca = execa as unknown as ReturnType<typeof vi.fn>;
const mockedDollar = $ as unknown as ReturnType<typeof vi.fn>;
const mockedReadFile = readFile as unknown as ReturnType<typeof vi.fn>;
const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;
const mockedInstallDevDependencies =
  installDevDependencies as unknown as ReturnType<typeof vi.fn>;
const mockedLogger = logger.debug as unknown as ReturnType<typeof vi.fn>;

describe("huskySetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = { packageManager: "npm" };

  beforeEach(() => {
    mockedExeca.mockClear();
    mockedDollar.mockClear();
    mockedReadFile.mockClear();
    mockedWriteFile.mockClear();
    mockedInstallDevDependencies.mockClear();
    mockedLogger.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call installDevDependencies with correct arguments", async () => {
    await huskySetup(projectPath, options);

    expect(mockedInstallDevDependencies).toHaveBeenCalledWith(
      options.packageManager,
      ["husky"],
      { cwd: projectPath },
    );
  });

  it("should call git init with $", async () => {
    await huskySetup(projectPath, options);

    expect(mockedDollar).toHaveBeenCalledWith("git", ["init"], {
      cwd: projectPath,
      stdout: ["pipe", "inherit"],
    });
    expect(mockedDollar).toHaveBeenCalled();
  });

  it("should call husky with execa", async () => {
    await huskySetup(projectPath, options);

    expect(mockedExeca).toHaveBeenCalledWith("husky", [], {
      cwd: projectPath,
      preferLocal: true,
      stdout: ["pipe", "inherit"],
    });
    expect(mockedExeca).toHaveBeenCalled();
  });

  it("should write commit-msg hook", async () => {
    await huskySetup(projectPath, options);

    const commitMsgPath = path.join(projectPath, ".husky", "commit-msg");

    expect(mockedWriteFile).toHaveBeenCalledWith(
      commitMsgPath,
      commitMsgCommands,
    );
  });

  it("should write pre-commit hook", async () => {
    await huskySetup(projectPath, options);

    const preCommitPath = path.join(projectPath, ".husky", "pre-commit");

    expect(mockedWriteFile).toHaveBeenCalledWith(
      preCommitPath,
      preCommitCommands,
    );
  });

  it("should log debug messages", async () => {
    await huskySetup(projectPath, options);

    expect(mockedLogger).toHaveBeenCalledWith("Setting up `husky`...");
    expect(mockedLogger).toHaveBeenCalledWith("`husky`setup completed...");
  });
});
