import { Item } from '@components/content/form/FormData'
import { publicFetch } from '@helpers/api/contentAPI'
import { isDynamic } from './formatDynamic'

interface Data {
  [key: string]: any
}

const formatEntry = async (entry?: [Item[]]) => {
  if (!entry) {
    return
  }

  const formattedEntry = entry

  for (let i = 0; i < entry.length; i++) {
    const items = entry[i]

    for (let j = 0; j < items.length; j++) {
      const item = items[j]

      if (
        item.options &&
        !Array.isArray(item.options) &&
        !isDynamic(item.options)
      ) {
        const fetchedOptions = await publicFetch({ url: item.options })
        formattedEntry[i][j].options = fetchedOptions
      }

      if (item.type == 'component') {
        formattedEntry[i][j].entry = await formatEntry(item.entry)
      }
    }
  }

  return formattedEntry
}

const formatData = (entry?: [Item[]]) => {
  if (!entry) {
    return null
  }

  const data: Data = {}

  for (let i = 0; i < entry.length; i++) {
    const items = entry[i]

    for (let j = 0; j < items.length; j++) {
      const item = items[j]

      if (item.type != 'asset') {
        data[item.key] = itemValue(item)
      }
    }
  }

  return data
}

const itemValue = (item: Item) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (item.type) {
    case 'string':
      return ''
    case 'richText':
      return ''
    case 'password':
      return null
    case 'uuid':
      return ''
    case 'link':
      return ''
    case 'boolean':
      return item.required ? false : null
    case 'date':
      return item.required ? today.toString() : null
    case 'datetime':
      return item.required ? today.toString() : null
    case 'multiselect':
      return []
    case 'component':
      switch (item.relation) {
        case 'single':
          return item.required ? formatData(item.entry) : null
        case 'multi':
          return item.required ? [formatData(item.entry)] : []
      }
    default:
      return null
  }
}

const formatPaths = ({
  routers,
  prefix = '',
  suffix = ''
}: {
  routers: { path: string; customPage?: boolean }[]
  prefix?: string
  suffix?: string
}) => {
  const paths: string[] = []

  routers.forEach((router) => {
    if (!router.path.includes('/single') && !router.customPage) {
      paths.push(`${prefix}${router.path}${suffix}`)
    }
  })

  return paths
}

export { formatEntry as default, formatData, formatPaths }
