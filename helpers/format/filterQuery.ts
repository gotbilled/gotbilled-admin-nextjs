// Base
import { NextRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'

// Redux
import { initialState } from '@redux/slices/tableDataSlice'

// Helpers
import { isString } from '@helpers/calc/typeCheck'
import { supportedLocales } from '@helpers/format/locale'

type Value = string | string[] | undefined

interface Data {
  [key: string]: string
}

interface FilterItem {
  key: string
  symbol: string
  value: string
}

const parseSearch = (value: Value) => {
  if (isString(value)) {
    return value
  } else {
    return initialState.query.search
  }
}

const parseFilter = (query: ParsedUrlQuery) => {
  const filter: FilterItem[] = []

  if (query.filter) {
    if (Array.isArray(query.filter)) {
      for (let i = 0; i < query.filter.length; i++) {
        const filterItem = query.filter[i]
        const parsedFilter = parseFilterItem(filterItem)

        if (parsedFilter) {
          filter.push(parsedFilter)
        }
      }
    } else {
      const parsedFilter = parseFilterItem(query.filter)

      if (parsedFilter) {
        filter.push(parsedFilter)
      }
    }
  }

  return filter
}

const parseFilterItem = (filter: string) => {
  try {
    return JSON.parse(filter) as FilterItem
  } catch {}
}

const parseLimit = (value: Value) => {
  if (isString(value)) {
    const valueNumber = parseInt(value)

    if (0 < valueNumber && valueNumber < 100) {
      return valueNumber
    }
  }

  return initialState.query.limit
}

const parseLocale = (value: Value) => {
  if (isString(value)) {
    if (
      supportedLocales.some(
        (supportedLocale) => supportedLocale.locale == value
      )
    ) {
      return value
    }
  }

  return initialState.query.locale
}

const parsePage = (value: Value) => {
  if (isString(value)) {
    const valueNumber = parseInt(value)

    if (0 < valueNumber) {
      return valueNumber
    }
  }

  return initialState.query.page
}

const parseSort = (
  value: Value
): { key: string; order: 'asc' | 'desc' } | null => {
  if (!isString(value)) {
    return initialState.query.sort
  }

  const [key, order] = value.split(':')

  if (!key || !order || (order != 'asc' && order != 'desc')) {
    return initialState.query.sort
  }

  return { key, order }
}

const updateQuery = ({
  key,
  value,
  router
}: {
  key: string
  value:
    | string
    | { key: string; symbol: string; value: string }[]
    | null
    | false
  router: NextRouter
}) => {
  const { [key]: oldKey, ...query } = router.query

  if (key != 'page') {
    delete query.page
  }

  if (value) {
    if (Array.isArray(value)) {
      const keyArray: string[] = []
      for (let i = 0; i < value.length; i++) {
        const item = value[i]
        keyArray.push(JSON.stringify(item))
      }
      query[key] = keyArray
    } else {
      query[key] = value
    }
  }

  router.replace({ query }, undefined, { shallow: true })
}

const filterToObject = (filter: FilterItem[]) => {
  const obj: Data = {}

  filter.forEach((item) => {
    obj[`${item.key}`] = `${item.symbol}${item.value}`
  })

  return obj
}

export {
  parseSearch,
  parseFilter,
  parseLimit,
  parseLocale,
  parsePage,
  parseSort,
  updateQuery,
  filterToObject
}
