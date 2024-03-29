import { hello } from "./index";
import { test } from "vitest";

test("hello('World') should return 'Hello, World!'", (t) => {
  t.assert.equal(hello("World"), "Hello, World!");
});
