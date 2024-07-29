import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { writeFile } from "fs/promises";
import path from "path";
import rcSetup from "./rc.js";
import { ProgramOptions } from "../options.js";

// Mock writeFile
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;

describe("rcSetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = {
    language: "TypeScript",
    target: "ES6",
    packageManager: "npm",
    testFramework: "jest",
    transpiler: "babel",
    bundler: "webpack",
  };

  beforeEach(() => {
    mockedWriteFile.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call writeFile with correct arguments", async () => {
    await rcSetup(projectPath, options);

    const rcPath = path.join(projectPath, ".createrc");
    const expectedContent = JSON.stringify(
      {
        language: options.language,
        target: options.target,
        packageManager: options.packageManager,
        testFramework: options.testFramework,
        transpiler: options.transpiler,
        bundler: options.bundler,
      },
      null,
      2,
    );

    expect(mockedWriteFile).toHaveBeenCalledWith(rcPath, expectedContent);
  });
});
