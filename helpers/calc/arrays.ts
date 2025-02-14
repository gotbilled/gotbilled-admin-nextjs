const insertUniqueItem = (array: any[], item: any, key: string) => {
  if (!array) {
    return [item]
  }

  if (array.some((arrayItem) => arrayItem[key] == item[key])) {
    return array
  } else {
    return [...array, item]
  }
}

const moreArrayElement = (array: any[], from: number, to: number) => {
  const smallerIndex = Math.min(from, to)
  const largerIndex = Math.max(from, to)

  return [
    ...array.slice(0, smallerIndex),
    ...(from < to ? array.slice(smallerIndex + 1, largerIndex + 1) : []),
    array[from],
    ...(from > to ? array.slice(smallerIndex, largerIndex) : []),
    ...array.slice(largerIndex + 1)
  ]
}

export { insertUniqueItem, moreArrayElement }
