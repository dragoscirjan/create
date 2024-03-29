import test from "ava";
import sinon from "sinon";

import { writeHello } from "../src";

test.beforeEach((t) => {
  // Spy on console.log and provide a mock implementation
  t.context.log = console.log;
  console.log = sinon.spy();
});

test.afterEach.always((t) => {
  // Restore console.log to its original implementation after each test
  console.log = t.context.log;
});

test('writeHello("World") to return "Hello, World!"', (t) => {
  writeHello("World");
  t.true(console.log.calledOnce);
  t.true(console.log.calledWith("Hello, World!"));
});
