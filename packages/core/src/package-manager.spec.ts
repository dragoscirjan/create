import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { execa, Options } from "execa";
import { installDependencies, installDevDependencies } from "./package-manager";

// Mock execa
vi.mock("execa", () => ({
  execa: vi.fn(),
}));

const mockedExeca = execa as unknown as ReturnType<typeof vi.fn>;

describe("installDependencies", () => {
  beforeEach(() => {
    mockedExeca.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call execa with correct arguments for npm", async () => {
    const packageManager = "npm";
    const modules = ["module1", "module2"];
    const options: Options = {};

    await installDependencies(packageManager, modules, options);

    expect(mockedExeca).toHaveBeenCalledWith(
      packageManager,
      ["install", "-S", ...modules],
      options,
    );
  });

  it("should call execa with correct arguments for yarn", async () => {
    const packageManager = "yarn";
    const modules = ["module1", "module2"];
    const options: Options = {};

    await installDependencies(packageManager, modules, options);

    expect(mockedExeca).toHaveBeenCalledWith(
      packageManager,
      ["add", ...modules],
      options,
    );
  });
});

describe("installDevDependencies", () => {
  beforeEach(() => {
    mockedExeca.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call execa with correct arguments for npm", async () => {
    const packageManager = "npm";
    const modules = ["module1", "module2"];
    const options: Options = {};

    await installDevDependencies(packageManager, modules, options);

    expect(mockedExeca).toHaveBeenCalledWith(
      packageManager,
      ["install", "-D", ...modules],
      options,
    );
  });

  it("should call execa with correct arguments for yarn", async () => {
    const packageManager = "yarn";
    const modules = ["module1", "module2"];
    const options: Options = {};

    await installDevDependencies(packageManager, modules, options);

    expect(mockedExeca).toHaveBeenCalledWith(
      packageManager,
      ["add", "-D", ...modules],
      options,
    );
  });
});
