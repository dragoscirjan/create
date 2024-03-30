import { describe, it, expect } from "mocha";

import { hello } from "./index";

describe("hello", function () {
  it('should return "Hello, World!" when given "World"', () => {
    expect(hello("World")).to.equal("Hello, World!");
  });
});
