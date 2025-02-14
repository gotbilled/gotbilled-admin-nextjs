// Interfaces
import { Item } from '@components/content/form/FormData'
import { Dispatch } from '@reduxjs/toolkit'

// Redux
import { showMessage } from '@redux/slices/utilitiesSlice'

// Helpers
import { writeHandler } from '@helpers/handlers/errorHandler'
import { fetcher } from '@helpers/api/httpMethods'

interface Data {
  [key: string]: any
}

interface ItemWithParent extends Item {
  parent?: string
}

const validateFields = ({
  fields,
  data,
  dispatch
}: {
  fields: ItemWithParent[]
  data: Data
  dispatch: Dispatch
}) => {
  const invalidFields = findInvalidFields({
    parentPath: '',
    items: fields,
    data
  })

  if (invalidFields.length > 0) {
    dispatch(
      showMessage({
        type: 'danger',
        title: 'Attention!',
        text: 'Empty required fields:',
        items: invalidFields.map(
          (item: ItemWithParent) =>
            `${item.parent ? `${item.parent} - ` : ''}${item.name}`
        )
      })
    )
    return false
  } else {
    return true
  }
}

const findInvalidFields = ({
  parentPath,
  items,
  data
}: {
  parentPath: string
  items: ItemWithParent[]
  data: Data
}) => {
  const invalidFields: ItemWithParent[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    if (
      item.required &&
      data &&
      (data[item.key] == null || data[item.key] === '')
    ) {
      invalidFields.push({ ...item, parent: parentPath })
      continue
    }

    if (item.type == 'component') {
      if (item.relation == 'multi' && data) {
        data[item.key].forEach((singleData: Data, i: number) => {
          const entry = getEntry(item, singleData)
          if (entry) {
            const nestedInvalidFields = findInvalidFields({
              parentPath: `${parentPath ? `${parentPath}.` : ''}${
                item.key
              }[${i}]`,
              items: entry.flat(),
              data: singleData
            })

            if (nestedInvalidFields.length > 0) {
              invalidFields.push(...nestedInvalidFields)
            }
          }
        })
      } else if (item.relation == 'single') {
        if (item.entry) {
          const nestedInvalidFields = findInvalidFields({
            parentPath: `${parentPath ? `${parentPath}.` : ''}${item.key}`,
            items: item.entry.flat(),
            data: data?.[item.key]
          })

          if (nestedInvalidFields.length > 0) {
            invalidFields.push(...nestedInvalidFields)
          }
        }
      }
    }
  }

  return invalidFields
}

const getEntry = (item: ItemWithParent, data: Data) => {
  if (item.dynamic) {
    const dynamicEntry = (item.entry as unknown as Item[]).find(
      (dynamicEntry) => dynamicEntry.key == data.component
    )

    if (dynamicEntry?.entry) {
      return dynamicEntry.entry
    }
  } else {
    return item.entry
  }
}

const writeEntry = async ({
  writer,
  params,
  localized,
  locale,
  section,
  content,
  setLoading,
  callback,
  dispatch
}: {
  writer: Function
  params: object
  localized: boolean
  locale: string
  section: string
  content: string
  setLoading: Function
  callback: Function
  dispatch: Dispatch
}) => {
  try {
    setLoading(true)

    const response = await writer(params)

    revalidateContent({
      section,
      content,
      key: response._id,
      locale,
      localized
    })

    callback(response)
  } catch (e) {
    const { text, items } = writeHandler(e)
    dispatch(
      showMessage({
        type: 'danger',
        title: 'Attention!',
        text,
        items
      })
    )
    setLoading(false)
  }
}

const revalidateContent = async ({
  section,
  content,
  key,
  locale,
  localized
}: {
  section: string
  content: string
  key: string | string[]
  locale: string
  localized: boolean
}) => {
  // if (process.env.NEXT_PUBLIC_VERCEL_ENV != 'production') return

  return await fetcher({
    url: '/api/revalidate',
    params: { section, content, key, locale, localized }
  })
}

export { writeEntry as default, validateFields, revalidateContent }
