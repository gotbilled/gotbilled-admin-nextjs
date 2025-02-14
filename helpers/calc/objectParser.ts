import { isObject } from './typeCheck'

const getPropByString = (o: any, s: string) => {
  try {
    s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    s = s.replace(/^\./, '') // strip a leading dot
    const a = s.split('.')
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i]
      if (k in o) {
        o = o[k]
      } else {
        return
      }
    }
    return o
  } catch (e) {
    return null
  }
}

const createNestedObject = (path: string, obj?: any) => {
  const reversedPath = path.split('.').reverse()

  const iter = ([head, ...tail]: any, obj: any): any => {
    if (!head) {
      return obj
    }
    const newObj = { [head]: obj ? { ...obj } : null }
    return iter(tail, newObj)
  }
  return iter(reversedPath, obj)
}

const mergeObjects = <T extends object>(target: T, source: T) => {
  const t = structuredClone(target)
  const s = structuredClone(source)
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const item of Object.keys(s)) {
    const key = item as keyof T
    const sourceKey = s[key] as T
    const targetKey = (t ? t[key] : null) as unknown as T
    if (isObject(sourceKey)) {
      Object.assign(
        sourceKey as T,
        mergeObjects<T>(targetKey as T, sourceKey as T)
      )
    }
  }
  // Join `target` and modified `source`
  Object.assign(t || {}, s)
  return t
}

const filterObjectByKeys = ({
  target,
  keys,
  inverted,
  matchKey = true
}: {
  target: object
  keys: string[]
  inverted?: boolean
  matchKey?: boolean
}) => {
  const targetKeys = Object.keys(target)

  const filtered: { [key: string]: unknown } = {}

  for (let i = 0; i < targetKeys.length; i++) {
    const key = targetKeys[i]
    const item = target[key as keyof object] as object

    if (keys.includes(key)) {
      if (inverted) {
        filtered[key as keyof object] = item
      }
    } else if (isObject(item)) {
      for (let j = 0; j < keys.length; j++) {
        const allowedItem = keys[j]

        const [base, ...nestedPath] = allowedItem.split('.')
        if (base && base == key) {
          filtered[base as keyof object] = filterObjectByKeys({
            target: item,
            keys: [nestedPath.join('.')],
            inverted,
            matchKey
          })
        } else if (!inverted) {
          if (!matchKey) {
            filtered[key] = filterObjectByKeys({
              target: item,
              keys,
              inverted,
              matchKey
            })
          } else {
            filtered[key] = item
          }
        }
      }
    } else if (!inverted) {
      Object.assign(filtered, { [key]: item })
    }
  }

  return filtered
}

export { getPropByString, createNestedObject, mergeObjects, filterObjectByKeys }
