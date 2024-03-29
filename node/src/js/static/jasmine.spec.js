import { hello } from "./index";

describe("hello", () => {
  it('should return "Hello, World!" when given "World"', () => {
    expect(hello("World")).toEqual("Hello, World!");
  });
});
