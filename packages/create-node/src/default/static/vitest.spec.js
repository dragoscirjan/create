import { test } from "vitest";

import { hello } from "./index";

test("hello('World') should return 'Hello, World!'", (t) => {
  t.assert.equal(hello("World"), "Hello, World!");
});
