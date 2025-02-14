// Base
import { ChangeEvent, useEffect, useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

// Auth
import { useSession } from 'next-auth/react'

// Packages
import {
  Box,
  Divider,
  Typography,
  Combobox,
  ComboboxOption,
  Link,
  IconButton,
  Flex
} from '@strapi/design-system'
import { MinusOutlined, MenuBurger, Earth } from '@strapi/icons'

// Components
import EntryBox from '@components/content/form/entry/EntryBox'
import SortableList from '@components/custom/SortableList'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editFormData } from '@redux/slices/formDataSlice'

// Helpers
import { useFetchInfinite } from '@helpers/api/useFetch'
import { authFetch } from '@helpers/api/contentAPI'
import { insertUniqueItem } from '@helpers/calc/arrays'

export interface Item {
  name: string
  key: string
  path: string
  content: {
    name: string
    key: string
    path: string
  }
  relation: 'single' | 'multi'
  required: boolean
  disabled?: boolean
  localized?: boolean
}

interface Data {
  [key: string]: any
}

const RelationSection = () => {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const {
    formView: { relations }
  } = useAppSelector((state) => state.staticProps)

  const data = useAppSelector((state) => state.formData)

  if (!relations) {
    return null
  }

  const updateRelation = ({ item, value }: { item: Item; value: object }) => {
    dispatch(editFormData({ [item.key]: value }))
  }

  return (
    <div>
      <Divider />
      <EntryBox>
        {relations.map((item: Item) => (
          <RelationInput
            relation={item}
            data={data[item.key]}
            locale={router.query.locale || data[item.key]?.i18n?.locale}
            onChange={(value: object) => updateRelation({ item, value })}
            key={item.key}
            disabled={
              item.disabled ||
              (!item.localized && router.isReady && !!data.i18n)
            }
          />
        ))}
      </EntryBox>
    </div>
  )
}

const RelationInput = ({
  relation,
  data,
  locale,
  onChange,
  disabled = false
}: {
  relation: Item
  data: any
  locale?: string
  onChange: Function
  disabled?: boolean
}) => {
  const addRelation = ({ item, value }: { item: Item; value: Data }) => {
    switch (item.relation) {
      case 'single':
        onChange(value)
        break
      case 'multi':
        onChange(insertUniqueItem(data, value, relation.content.key))
        break
    }
  }

  const onChangeRelationSort = ({
    item,
    relation
  }: {
    item: Item
    relation: Data[]
  }) => {
    onChange(relation)
  }

  const removeRelation = ({ item, value }: { item: Item; value: string }) => {
    switch (item.relation) {
      case 'single':
        onChange(null)
        break
      case 'multi':
        onChange(
          data.filter((relation: Data) => relation[item.content.key] != value)
        )
        break
    }
  }

  return (
    <div>
      <ComboboxLazyLoading
        item={relation}
        selected={data?.length}
        onAdd={addRelation}
        locale={locale}
        disabled={disabled}
      />
      <RelationItems
        item={relation}
        relations={data}
        onChange={onChangeRelationSort}
        onRemove={removeRelation}
        disabled={disabled}
      />
    </div>
  )
}

const ComboboxLazyLoading = ({
  item,
  onAdd,
  selected,
  locale,
  disabled = false
}: {
  item: Item
  onAdd: Function
  selected: number
  locale?: string
  disabled?: boolean
}) => {
  const { data: session } = useSession()

  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')
  const [reachedEnd, setReachedEnd] = useState(false)

  const { data, validating, loadMore } = useFetchInfinite(
    (page: number) =>
      session && {
        url: item.path,
        params: {
          _skip: page * 7,
          _limit: 7,
          [item.content.name || '_id']: `${
            item.content.name ? '~' : ''
          }${query}`,
          _locale: locale
        },
        token: session.jwt
      },
    authFetch,
    [query, session?.jwt]
  )

  useEffect(() => {
    if (data) {
      setOptions(data.flat())

      if (data[data.length - 1].length < 7) {
        setReachedEnd(true)
      } else {
        setReachedEnd(false)
      }
    }
  }, [data])

  return (
    <Box paddingBottom={1}>
      <Combobox
        label={`${item.name} ${selected ? `(${selected})` : ''}`}
        value=""
        onChange={(value: string) =>
          onAdd({
            item,
            value: options.find((option) => option[item.content.key] == value)
          })
        }
        onInputChange={(e: ChangeEvent<HTMLInputElement>) =>
          setQuery(e.target.value)
        }
        loading={validating}
        hasMoreItems={!reachedEnd}
        onLoadMore={loadMore}
        // labelAction={
        //   <Link href={`/entry/${item.content.path}`} as={NextLink}>
        //     {'abc'}
        //   </Link>
        // }
        labelAction={item.localized && <Earth />}
        required={item.required}
        disabled={item.disabled || disabled}
      >
        {options.map((option) => (
          <ComboboxOption
            value={option[item.content.key]}
            key={option[item.content.key]}
          >
            {option[item.content.name || '_id']}
          </ComboboxOption>
        ))}
      </Combobox>
    </Box>
  )
}

const RelationItems = ({
  item,
  relations,
  onChange,
  onRemove,
  disabled
}: {
  item: Item
  relations?: Data | Data[]
  onChange: Function
  onRemove: Function
  disabled?: boolean
}) => {
  if (!relations) {
    return null
  }

  if (Array.isArray(relations)) {
    return (
      <div className={relations.length > 5 ? 'scrollable' : ''}>
        <SortableList
          handle=".drag"
          list={relations}
          onChange={(relation: Data[]) => onChange({ item, relation })}
        >
          {relations.map((relation) => (
            <RelationItem
              item={item}
              relation={relation}
              onRemove={onRemove}
              key={relation[item.content.key]}
              disabled={disabled}
            />
          ))}
        </SortableList>
      </div>
    )
  }

  return (
    <RelationItem
      item={item}
      relation={relations}
      onRemove={onRemove}
      disabled={disabled}
    />
  )
}

const RelationItem = ({
  item,
  relation,
  onRemove,
  disabled
}: {
  item: Item
  relation: Data
  onRemove: Function
  disabled?: boolean
}) => {
  return (
    <Flex justifyContent="space-between">
      <Flex style={{ maxWidth: 'calc(100% - 40px)', overflow: 'hidden' }}>
        <IconButton
          aria-label="Drag"
          noBorder
          icon={<MenuBurger />}
          className={!item.disabled ? 'drag' : ''}
        />

        <Link
          href={`/entry/${item.content.path}/update/${
            relation[item.content.key]
          }`}
          as={NextLink}
        >
          <Box>
            <Typography ellipsis>
              {relation[item.content.name || '_id']}
            </Typography>
          </Box>
        </Link>
      </Flex>

      {!item.disabled && !disabled && (
        <IconButton
          onClick={() => onRemove({ item, value: relation[item.content.key] })}
          label="Remove"
          noBorder
          icon={<MinusOutlined />}
        />
      )}
    </Flex>
  )
}

export { RelationSection as default, RelationInput }
