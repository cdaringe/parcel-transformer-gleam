import { cloneDeepWith } from 'lodash'
import isPlainObject from 'is-plain-object'

const isPrimitive = (value: any) =>
  (typeof value !== 'object' && typeof value !== 'function') || value === null

export = function primitivify<T = {}> (obj: any, onVisit?: (v: any) => any): T {
  return cloneDeepWith(obj, _value => {
    const value = onVisit ? onVisit(_value) : _value
    if (isPrimitive(value)) return value
    if (Array.isArray(value)) return value.map(v => primitivify(v, onVisit))
    if (isPlainObject(value)) {
      const next: any = {}
      for (const key in value) {
        const subValue = value[key]
        next[key] = primitivify(subValue, onVisit)
      }
      return next
    }
    return null
  })
}
