import { cloneDeepWith } from 'lodash'
import isPlainObject from 'is-plain-object'

const isPrimitive = (value: any) =>
  (typeof value !== 'object' && typeof value !== 'function') || value === null

export = function primitivify<T = {}> (obj: any): T {
  return cloneDeepWith(obj, value => {
    if (isPrimitive(value)) return value
    if (Array.isArray(value)) return value.map(primitivify)
    if (isPlainObject(value)) {
      const next: any = {}
      for (const key in value) {
        const subValue = value[key]
        next[key] = primitivify(subValue)
      }
      return next
    }
    return null
  })
}
