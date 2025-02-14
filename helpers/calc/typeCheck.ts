const isObject = (val: unknown): val is object => {
  if (val === null || val instanceof Date) {
    return false
  }
  return typeof val === 'function' || typeof val === 'object'
}

const isString = (val: unknown): val is string => {
  return typeof val === 'string' || val instanceof String
}

export { isObject, isString }
