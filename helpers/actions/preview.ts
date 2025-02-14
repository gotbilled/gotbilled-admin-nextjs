// Helpers
import { getDefaultLocale } from '@helpers/format/locale'
import { getPropByString } from '../calc/objectParser'

// Interfaces
import { Item } from '@components/content/table/view/EntryData'

const parsePreviewForm = (
  link: string | undefined,
  locale: string,
  data?: object
) => {
  if (!link) {
    return
  }

  let previewLink = link

  if (
    (locale != getDefaultLocale() && !previewLink.includes('[i18n.locale]')) ||
    (locale == getDefaultLocale() && previewLink.includes('[i18n.locale]'))
  ) {
    return
  }

  const matches = previewLink.match(/\[(.*?)\]/g)

  if (matches) {
    matches.forEach((match: string) => {
      const value = getPropByString(data, match.slice(1, -1))

      if (value) {
        previewLink = previewLink.replace(match, value)
      }
    })
  }

  return previewLink
}

const parsePreviewTable = (link: string, items: Item[]) => {
  let previewLink = link

  const matches = previewLink.match(/\[(.*?)\]/g)

  if (matches) {
    matches.forEach((match: string) => {
      const item = items.find((item) => item.key == match.slice(1, -1))

      if (item) {
        previewLink = previewLink.replace(match, item.value)
      }
    })
  }

  return previewLink
}

export { parsePreviewForm, parsePreviewTable }
