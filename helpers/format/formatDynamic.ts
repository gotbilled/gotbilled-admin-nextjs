const isDynamic = (value: string) => {
  return /\{.{1,}\}/.test(value)
}

const formatDynamic = (value: string, dynamicValue: string) => {
  const matches = /\{.{1,}\}/.exec(value)

  if (!matches) {
    return
  }

  const dynamicKey = matches[0]

  return value.replace(dynamicKey, dynamicValue)
}

export { formatDynamic as default, isDynamic }
