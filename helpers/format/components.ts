import { Item } from '@components/content/form/FormData'
import { getPropByString } from '../calc/objectParser'

const fromatTitle = ({ item, data }: { item: Item; data: any }) => {
  if (!item.primary) {
    return item.name
  } else if (Array.isArray(item.primary)) {
    return (
      item.primary
        .map((singleItem) => getPropByString(data, singleItem))
        .join(' ')
        .trim() || '-'
    )
  } else {
    if (item.entry) {
      const entry = item.entry.flat()
      const field = entry.find((entryItem) => entryItem.key == item.primary)

      if (field?.options) {
        const primaryValue = data[item.primary]
        const selectedOption = field.options.find(
          (option) => option.key == primaryValue
        )

        if (selectedOption) {
          return selectedOption.name || selectedOption.key
        }
      }
    }
    return getPropByString(data, item.primary) || '-'
  }
}

export { fromatTitle }
