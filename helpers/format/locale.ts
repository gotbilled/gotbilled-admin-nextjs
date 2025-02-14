import supportedLocales from 'public/data/i18n.json'

// Interfaces
import { Item } from '@components/content/form/FormData'

const getDefaultLocale = () => {
  const defaultLocale = supportedLocales.find((locale) => locale.default)

  if (defaultLocale) {
    return defaultLocale.locale
  } else {
    return 'en'
  }
}

const getLocalizedFields = (entry: [Item[]], parent: string = '') => {
  const localizedFields: string[] = []

  entry.flat().forEach((item) => {
    if (item.localized) {
      localizedFields.push(`${parent}${item.key}`)
    } else if (item.type == 'component' && item.entry) {
      const componentLocalizedFields = getLocalizedFields(
        item.entry,
        `${parent}${item.key}.`
      )

      if (componentLocalizedFields) {
        localizedFields.push(...componentLocalizedFields)
      }
    }
  })

  return localizedFields
}

export { supportedLocales, getDefaultLocale, getLocalizedFields }
