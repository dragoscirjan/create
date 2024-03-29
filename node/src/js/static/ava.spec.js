import test from "ava";
import { hello } from "./index";

test('hello("World") to return "Hello, World!"', (t) => {
  t.is(hello("World"), "Hello, World!");
});
