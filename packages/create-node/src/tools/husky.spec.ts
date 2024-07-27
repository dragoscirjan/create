import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { installDevDependencies, logger } from "@templ-project/core";
import { execa, $ } from "execa";
import { readFile, writeFile } from "fs/promises";
import path from "path";

import huskySetup, { commitMsgCommands, preCommitCommands } from "./husky";
import { ProgramOptions } from "../options";

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

describe("husky setup", () => {
  const projectPath = "/mocked/path";
  const options = { packageManager: "npm" } as unknown as ProgramOptions;

  beforeEach(() => {
    mockedExeca.mockClear();
    mockedDollar.mockClear();
    mockedReadFile.mockClear();
    mockedWriteFile.mockClear();
    mockedInstallDevDependencies.mockClear();
    mockedLogger.mockClear();

    mockedReadFile.mockResolvedValue(Buffer.from("existing content"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call installDevDependencies", async () => {
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

  it("should read and write commit-msg hook", async () => {
    await huskySetup(projectPath, options);

    const commitMsgPath = path.join(projectPath, ".husky", "commit-msg");

    expect(mockedReadFile).toHaveBeenCalledWith(commitMsgPath);
    expect(mockedWriteFile).toHaveBeenCalledWith(
      commitMsgPath,
      `existing content

${commitMsgCommands}

`,
    );
  });

  it("should read and write pre-commit hook", async () => {
    await huskySetup(projectPath, options);

    const precommitPath = path.join(projectPath, ".husky", "pre-commit");

    expect(mockedReadFile).toHaveBeenCalledWith(precommitPath);
    expect(mockedWriteFile).toHaveBeenCalledWith(
      precommitPath,
      `existing content

${preCommitCommands}

`,
    );
  });
});
