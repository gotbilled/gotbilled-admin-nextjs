// Base
import { useRouter } from 'next/router'

// Components
import EntryBox from '@components/content/form/entry/EntryBox'
import EntryItem from '@components/content/form/entry/EntryItem'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editFormObject } from '@redux/slices/formDataSlice'

// Interfaces
import { Item } from '@components/content/form/FormData'
import { getPropByString } from '@helpers/calc/objectParser'

const EntryForm = ({
  entry,
  parentPath = '',
  raw,
  localized,
  onChangeEntry
}: {
  entry?: [Item[]]
  parentPath?: string
  raw?: boolean
  localized?: boolean
  onChangeEntry?: Function
}) => {
  const router = useRouter()
  const data = useAppSelector((state) => state.formData)

  const dispatch = useAppDispatch()

  if (!entry) {
    return null
  }

  const getValue = (key: string) => {
    return getPropByString(data, `${parentPath ? `${parentPath}.` : ''}${key}`)
  }

  const getReference = (reference?: string) => {
    if (!reference) {
      return
    }

    return getValue(reference)
  }

  const onChange = (key: string, value: any, override?: boolean) => {
    if (onChangeEntry) {
      onChangeEntry(key, value, override)
      return
    }

    dispatch(
      editFormObject({
        parentPath,
        data: {
          [key]: value
        },
        override
      })
    )
  }

  return (
    <EntryBox padding={!raw ? 6 : 0}>
      {entry.map((items, i) => (
        <div className="content-row" key={i}>
          {items.map((item) => (
            <EntryItem
              item={item}
              value={getValue(item.key)}
              parentPath={parentPath}
              reference={getReference(item.reference)}
              localized={localized || (router.isReady && !data.i18n)}
              onChange={(value: any, override?: boolean) =>
                onChange(item.key, value, override)
              }
              key={item.key}
            />
          ))}
        </div>
      ))}
    </EntryBox>
  )
}

export default EntryForm
