/* eslint-disable max-lines-per-function */
import sinon from "sinon";

import { writeHello } from "../src";

describe("writeHello", function () {
  let consoleLogStub;

  beforeEach(function () {
    // Stub console.log
    consoleLogStub = sinon.stub(console, "log");
    // Prevent console.log from printing
    consoleLogStub.returns();
  });

  afterEach(function () {
    // Restore the original console.log function
    consoleLogStub.restore();
  });

  it('should log "Hello, World!" when called with "World"', function () {
    writeHello("World");
    sinon.assert.calledOnce(consoleLogStub);
    sinon.assert.calledWithExactly(consoleLogStub, "Hello, World!");
  });
});
