import { describe, it, expect } from "vitest";
import { transpileTsToJs } from "./transpile";

const tsCode1 = `import { calculateArea } from './math';
export default class Circle {
  constructor(public radius: number) {}
  getArea(): number {
    return calculateArea(this.radius);
  }
}`;

const expectedCjsJsCode1 = `"use strict";

var _math = require("./math");
class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  getArea() {
    return (0, _math.calculateArea)(this.radius);
  }
}
module.exports = Circle;`;

const expectedStripedJsCode1 = `import { calculateArea } from './math';
export default class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  getArea() {
    return calculateArea(this.radius);
  }
}`;

const expectedEsmCode1 = `import { calculateArea } from './math.js';
export default class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  getArea() {
    return calculateArea(this.radius);
  }
}`;

const tsCode2 = `import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"],
  },
});`;

const expectedStripedJsCode2 = `import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    exclude: ["**/node_modules/**"]
  }
});`;

describe("transpile", () => {
  describe("transpileTsToJs", () => {
    it("should transpile TypeScript to CommonJs", () => {
      const result = transpileTsToJs(tsCode1, "cjs");
      expect(result.trim()).toBe(expectedCjsJsCode1.trim());
    });

    it("should transpile TypeScript to striped TypeScript", () => {
      const result = transpileTsToJs(tsCode1, "strip");
      expect(result.trim()).toBe(expectedStripedJsCode1.trim());
    });

    it("should transpile TypeScript to ESM JavaScript", () => {
      const result = transpileTsToJs(tsCode1, "esm");
      expect(result.trim()).toBe(expectedEsmCode1.trim());
    });

    it("should throw an error if Babel fails to transpile", () => {
      const invalidTsCode = `import { calculateArea } from './math';
    import { Shape } from './shapes';

    class Circle {
      constructor(public radius: number) {}

      getArea(): number {
        return calculateArea(this.radius);
      }
      `; // Missing closing bracket

      expect(() => transpileTsToJs(invalidTsCode, "esm")).toThrow();
    });
  });
});
