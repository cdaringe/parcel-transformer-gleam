import ava, { TestInterface } from 'ava'
import primitivify from '../src'

const test = ava as TestInterface<{}>

test('identity primitives', t => {
  t.is(0, primitivify(0), 'numbers')
  t.is(-1, primitivify(-1), 'numbers')
  t.is(NaN, primitivify(NaN), 'kindof stupid js numbers')
  t.is(Infinity, primitivify(Infinity), 'kindof stupid js numbers')
  t.is(null, primitivify(null), 'null')
  t.is(undefined, primitivify(undefined), 'undefined')
})

test('identity collections', t => {
  const empty: any[] = []
  const numbers = [1, 2, 3]
  const strings = ['a', 'b', 'c']
  const complex = [1, '2', { c: { d: [4, 5, { e: { f: 2 } }] } }]
  const obj = { a: 1, b: undefined, c: -1 }
  t.deepEqual(empty, primitivify(empty), 'empty')
  t.deepEqual(numbers, primitivify(numbers), 'numbers')
  t.deepEqual(strings, primitivify(strings), 'strings')
  t.deepEqual(complex, primitivify(complex), 'complex')
  t.deepEqual(obj, primitivify(obj), 'obj')
})

test('non-identity transforms', t => {
  const dummyFn = () => {}
  const complexArr = [
    1,
    {
      c: NaN,
      d: [1, Infinity, dummyFn],
      e: setTimeout(() => {}, 0)
    },
    dummyFn
  ]
  t.deepEqual(
    [1, { c: NaN, d: [1, Infinity, null], e: null }, null],
    primitivify(complexArr),
    'complex'
  )

  const complexObj = {
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
    {
      dummyFn: null,
      a: {
        b: {
          c: null
        },
        d: null
      },
      b: [null, 'wee', { e: 'e' }]
    },
    primitivify(complexObj),
    'complexObj'
  )
  clearInterval(complexObj.a.d)
})
