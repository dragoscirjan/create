import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import codeSetup, { code } from "./code.js";
import { ProgramOptions } from "../options.js";
import { AvailableLanguages } from "@templ-project/core";

// Mock mkdir and writeFile
vi.mock("fs/promises", () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

const mockedMkdir = mkdir as unknown as ReturnType<typeof vi.fn>;
const mockedWriteFile = writeFile as unknown as ReturnType<typeof vi.fn>;

describe("codeSetup", () => {
  const projectPath = "/mocked/path";
  const options: ProgramOptions = {
    packageManager: "npm",
    language: AvailableLanguages.Ts, // Change this to test different languages
    target: "ES6",
    testFramework: "jest",
    transpiler: "babel",
    bundler: "webpack",
  };

  beforeEach(() => {
    mockedMkdir.mockClear();
    mockedWriteFile.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call mkdir to create src directory", async () => {
    await codeSetup(projectPath, options);

    const srcPath = path.join(projectPath, "src");

    expect(mockedMkdir).toHaveBeenCalledWith(srcPath, { recursive: true });
  });

  it("should call writeFile with correct arguments for TypeScript", async () => {
    await codeSetup(projectPath, options);

    const filePath = path.join(projectPath, "src", "index.ts");
    const expectedContent = code[AvailableLanguages.Ts];

    expect(mockedWriteFile).toHaveBeenCalledWith(filePath, expectedContent);
  });

  it("should call writeFile with correct arguments for JavaScript", async () => {
    const jsOptions = { ...options, language: AvailableLanguages.Js };
    await codeSetup(projectPath, jsOptions);

    const filePath = path.join(projectPath, "src", "index.js");
    const expectedContent = code[AvailableLanguages.Js];

    expect(mockedWriteFile).toHaveBeenCalledWith(filePath, expectedContent);
  });

  // it("should call writeFile with correct arguments for CoffeeScript", async () => {
  //   const coffeeOptions = { ...options, language: AvailableLanguages.Coffee };
  //   await codeSetup(projectPath, coffeeOptions);

  //   const filePath = path.join(projectPath, "src", "index.coffee");
  //   const expectedContent = code[AvailableLanguages.Coffee];

  //   expect(mockedWriteFile).toHaveBeenCalledWith(filePath, expectedContent);
  // });
});
