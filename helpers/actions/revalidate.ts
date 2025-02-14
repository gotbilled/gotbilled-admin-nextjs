// Helpers
import { authFetch, publicFetch } from '@helpers/api/contentAPI'
import { getPropByString } from '@helpers/calc/objectParser'
import { parsePreviewForm } from './preview'
import { RawAxiosRequestHeaders } from 'axios'
import { getDefaultLocale } from '@helpers/format/locale'
import { EntryLocale } from '@components/content/form/Localization'

interface Data {
  [key: string]: any
}

type Paths = string | string[]

interface Revalidate {
  static?: Paths
  dynamic?: Paths
  domain: string
  relations?: {
    key: string
    dynamic: Paths
  }[]
  populate: Paths
}

const getRevalidatePaths = async ({
  section,
  content,
  locale,
  key,
  token,
  headers,
  localized
}: {
  section: string
  content: string
  locale: string
  key: string | string[]
  token?: string
  headers?: RawAxiosRequestHeaders
  localized?: boolean
}) => {
  const formView = (
    await import(`public/views/${section}/form/${content}.json`)
  ).default

  if (formView.actions?.revalidate) {
    const revalidate: Revalidate = formView.actions.revalidate

    const contentData = token
      ? await authFetch({
          url: `${formView.path}`,
          params: {
            _id: key,
            _populate: revalidate.populate,
            _locale: locale != getDefaultLocale() ? locale : undefined
          },
          token,
          headers
        })
      : await publicFetch({
          url: `${formView.path}`,
          params: {
            _id: key,
            _populate: revalidate.populate,
            _locale: locale != getDefaultLocale() ? locale : undefined
          }
        })

    const paths: string[] = []

    if (revalidate.static && locale == getDefaultLocale()) {
      const revalidatePaths = parseRevalidateData(revalidate.static, locale)
      paths.push(...revalidatePaths)
    }

    if (content.endsWith('/single')) {
      const data = contentData
      const revalidatePaths = parseRevalidatePaths(revalidate, locale, data)

      revalidatePaths.forEach((revalidatePath) => {
        if (!paths.some((path) => path == revalidatePath)) {
          paths.push(revalidatePath)
        }
      })
    } else {
      for (let i = 0; i < contentData.length; i++) {
        const data = contentData[i]
        const revalidatePaths = parseRevalidatePaths(revalidate, locale, data)

        revalidatePaths.forEach((revalidatePath) => {
          if (!paths.some((path) => path == revalidatePath)) {
            paths.push(revalidatePath)
          }
        })
      }
    }

    if (localized && token && locale && locale == getDefaultLocale()) {
      const keys = Array.isArray(key) ? key : [key]

      const entryLocales: EntryLocale[] = []

      for (let i = 0; i < keys.length; i++) {
        const entryKey = keys[i]

        const entryKeyLocales: EntryLocale[] = await authFetch({
          url: `${formView.path}/${entryKey}/locales`,
          token,
          headers
        })

        entryLocales.push(...entryKeyLocales)
      }

      for (let i = 0; i < entryLocales.length; i++) {
        const entryLocale = entryLocales[i]

        if (entryLocale.i18n) {
          const localePaths = await getRevalidatePaths({
            section,
            content,
            locale: entryLocale.i18n.locale,
            key: entryLocale._id,
            token,
            headers,
            localized
          })

          if (localePaths) {
            paths.push(...localePaths.paths)
          }
        }
      }
    }

    return { paths, domain: revalidate.domain }
  }
}

const parseRevalidatePaths = (
  revalidate: Revalidate,
  locale: string,
  data: Data
) => {
  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') return

  const paths: string[] = []

  if (revalidate.dynamic) {
    const parsedPaths = parseRevalidateData(revalidate.dynamic, locale, data)

    paths.push(...parsedPaths)
  }

  if (revalidate.relations) {
    revalidate.relations.forEach((revalidateItem) => {
      const revalidateData = getPropByString(data, revalidateItem.key)
      if (!Array.isArray(revalidateData)) {
        const parsedPaths = parseRevalidateData(
          revalidateItem.dynamic,
          revalidateData
        )

        paths.push(...parsedPaths)
      } else {
        revalidateData.forEach((dataItem: Data) => {
          const parsedPaths = parseRevalidateData(
            revalidateItem.dynamic,
            locale,
            dataItem
          )

          paths.push(...parsedPaths)
        })
      }
    })
  }

  return paths
}

const parseRevalidateData = (
  paths: string | string[],
  locale: string,
  data?: Data
) => {
  return Array.isArray(paths)
    ? parsePaths(paths, locale, data)
    : parsePaths([paths], locale, data)
}

const parsePaths = (paths: string[], locale: string, data?: Data) => {
  if (!data) {
    return paths
  }

  let parsedPaths: string[] = []

  paths.forEach((path) => {
    const parsedPath = parsePreviewForm(path, locale, data)

    if (parsedPath) {
      parsedPaths.push(parsedPath)
    }
  })

  return parsedPaths
}

export { getRevalidatePaths }
