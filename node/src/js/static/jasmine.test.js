import { writeHello } from "../src";
import sinon from "sinon";

describe("writeHello", () => {
  let consoleLogSpy;

  beforeAll(() => {
    consoleLogSpy = sinon.spy(console, "log");
  });

  afterEach(() => {
    // Clear spy call history after each test
    consoleLogSpy.resetHistory();
  });

  afterAll(() => {
    // Restore console.log to its original implementation after all tests
    consoleLogSpy.restore();
  });

  it('should log "Hello, World!" when called with "World"', () => {
    writeHello("World");
    expect(consoleLogSpy.calledOnceWithExactly("Hello, World!")).toBe(true);
  });
});
