/* eslint-disable max-lines-per-function */

import { writeHello } from "../src";
import { beforeAll, afterAll, afterEach, describe, it, expect, vi } from "vitest";

describe("writeHello", (t) => {
  let consoleMock;

  beforeAll(() => {
    consoleMock = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleMock.mockClear();
  });

  afterAll(() => {
    consoleMock.mockReset();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    // Call the function under test
    writeHello("World");

    // Assert that console.log was called once with the expected argument
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith("Hello, World!");
  });
});
