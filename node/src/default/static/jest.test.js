/* eslint-disable max-lines-per-function */
import { writeHello } from "../src";

describe("writeHello", () => {
  let consoleSpy;

  beforeAll(() => {
    // Spy on console.log and provide a mock implementation
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear mock call history after each test
    consoleSpy.mockClear();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    consoleSpy.mockRestore();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    writeHello("World");
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Hello, World!");
  });
});
