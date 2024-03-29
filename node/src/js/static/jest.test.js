/* eslint-disable max-lines-per-function */

import { writeHello } from "../src";

describe("writeHello", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Spy on console.log and provide a mock implementation
  });

  afterEach(() => {
    // Clear mock call history after each test
    console.log.mockClear();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    console.log.mockRestore();
  });

  it('writeHello("World") to return "Hello, World!"', () => {
    writeHello("World");
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Hello, World!");
  });
});
