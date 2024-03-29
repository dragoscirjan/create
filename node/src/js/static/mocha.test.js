import { writeHello } from "../src";
import sinon from "sinon";

describe("writeHello", function () {
  let consoleLogSpy;

  before(function () {
    consoleLogSpy = sinon.spy(console, "log");
  });

  afterEach(function () {
    // Clear spy call history after each test
    consoleLogSpy.resetHistory();
  });

  after(function () {
    // Restore console.log to its original implementation after all tests
    consoleLogSpy.restore();
  });

  it('should log "Hello, World!" when called with "World"', function () {
    writeHello("World");
    expect(consoleLogSpy.calledOnce).to.be.true;
    expect(consoleLogSpy.calledOnceWith("Hello, World!")).to.be.true;
  });
});
