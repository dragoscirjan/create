/* eslint-disable max-lines-per-function */

import anyTest, { TestFn } from "ava";
import * as sinon from "sinon";

const test = anyTest as TestFn<{ log: typeof console.log }>;

import { writeHello } from "../src";

test.beforeEach((t) => {
  // Spy on console.log and provide a mock implementation
  t.context = { log: console.log };
  console.log = sinon.spy();
});

test.afterEach.always((t) => {
  // Restore console.log to its original implementation after each test
  console.log = (t.context as any).log;
});

test('writeHello("World") to return "Hello, World!"', (t) => {
  writeHello("World");
  t.true((console.log as any).calledOnce);
  t.true((console.log as any).calledWith("Hello, World!"));
});
