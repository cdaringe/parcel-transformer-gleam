# primitivify

deep copy data keeping only primitives in nested data structures. useful for serializing complex objects where you only care about the raw data contained within.

"primitive-ify"

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![TypeScript package](https://img.shields.io/badge/language-typescript-blue)](https://www.typescriptlang.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## install

`npm install --save primitivify`

## usage

the best demonstration of the value of this module is exemplified from the tests!

```ts
import primitivify from 'primitivify'
const dummyFn = () => {}
const complex = {
  dummyFn,
  a: {
    b: {
      c: setTimeout(() => {}, 0)
    },
    d: setInterval(dummyFn, 1e3)
  },
  b: [dummyFn, 'wee', { e: 'e' }]
}
t.deepEqual(
  { // observe how non-primitive datas are nulled away
    dummyFn: null,
    a: {
      b: {
        c: null
      },
      d: null
    },
    b: [null, 'wee', { e: 'e' } ]
  },
  primitivify(complexObj),
  'complex'
)
```

primitivify is immutable--calls return deeply cloned values.

need a _custom_ serializer? use the 2nd argument, `onVisit`, to transform the current value being inspected:

```ts
primitivify(
  { a: () => {} },
  v => typeof v === 'function' ? 'wee' : v)
)
// { a: 'wee' }

### why

generally to decomplect objects and/or arrays.  consinder a simple example:

```js
JSON.stringify({ usefulData: 'beep', a: setTimeout(() => {},0) })

/*
Thrown:
TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Timeout'
    |     property '_idlePrev' -> object with constructor 'TimersList'
    --- property '_idleNext' closes the circle
    at JSON.stringify (<anonymous>)
*/


JSON.stringify(primitivify({ a: setTimeout(() => {},0) }))
/*
'{"usefulData":"beep","a":null}'
*/
```
