// i18n
import { publicFetch } from '@helpers/api/contentAPI'
import supportedLocales from 'public/data/i18n.json'

interface Currency {
  symbol: string
  name: string
  symbol_native: string
  decimal_digits: number
  rounding: number
  key: string
  name_plural: string
}

const getDefaultCurrency = () => {
  const defaultLocale = supportedLocales.find((locale) => locale.default)

  return defaultLocale?.currency
}

const getCurrency = async (key: string) => {
  const currencies: Currency[] = await publicFetch({
    url: '/public/data/currencies.json'
  })

  return currencies.find((currency) => currency.key == key)
}

export { getDefaultCurrency, getCurrency }
