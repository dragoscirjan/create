import { writeHello } from "../src";
import { afterAll, describe, it, expect, vi } from "vitest";

describe("writeHello", (t) => {
  const consoleMock = vi.spyOn(console, "log").mockImplementation(() => undefined);

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
