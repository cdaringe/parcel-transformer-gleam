import test from "node:test";
import assert from "node:assert";
import { primitivify } from "../src";

test("identity primitives", () => {
  assert.equal(0, primitivify(0), "numbers");
  assert.equal(-1, primitivify(-1), "numbers");
  assert.equal(NaN, primitivify(NaN), "kindof stupid js numbers");
  assert.equal(Infinity, primitivify(Infinity), "kindof stupid js numbers");
  assert.equal(null, primitivify(null), "null");
  assert.equal(undefined, primitivify(undefined), "undefined");
});

test("identity collections", () => {
  const empty: any[] = [];
  const numbers = [1, 2, 3];
  const strings = ["a", "b", "c"];
  const complex = [1, "2", { c: { d: [4, 5, { e: { f: 2 } }] } }];
  const obj = { a: 1, b: undefined, c: -1 };
  assert.deepStrictEqual(empty, primitivify(empty), "empty");
  assert.deepStrictEqual(numbers, primitivify(numbers), "numbers");
  assert.deepStrictEqual(strings, primitivify(strings), "strings");
  assert.deepStrictEqual(complex, primitivify(complex), "complex");
  assert.deepStrictEqual(obj, primitivify(obj), "obj");
});

test("non-identity transforms", (t) => {
  const dummyFn = () => {};
  const complexArr = [
    1,
    {
      c: NaN,
      d: [1, Infinity, dummyFn],
      e: setTimeout(() => {}, 0),
    },
    dummyFn,
  ];
  assert.deepStrictEqual(
    [1, { c: NaN, d: [1, Infinity, null], e: null }, null],
    primitivify(complexArr),
    "complex",
  );

  const complexObj = {
    dummyFn,
    a: {
      b: {
        c: setTimeout(() => {}, 0),
      },
      d: setInterval(dummyFn, 1e3),
    },
    b: [dummyFn, "wee", { e: "e" }],
  };
  assert.deepStrictEqual(
    {
      dummyFn: null,
      a: {
        b: {
          c: null,
        },
        d: null,
      },
      b: [null, "wee", { e: "e" }],
    },
    primitivify(complexObj),
    "complexObj",
  );
  clearInterval(complexObj.a.d);
});

test("onVisit", (t) => {
  assert.deepStrictEqual(
    primitivify({ a: () => {} }, (v) => (typeof v === "function" ? "wee" : v)),
    { a: "wee" },
    "allows visit modifiers",
  );
});
