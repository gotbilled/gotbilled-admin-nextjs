// Base
import { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

// Packages
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  BaseCheckbox,
  Typography,
  Flex,
  TextButton,
  Icon
} from '@strapi/design-system'
import {
  Pencil,
  Trash,
  Duplicate,
  CarretDown,
  CarretUp,
  Filter,
  Search,
  Eye
} from '@strapi/icons'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  selectEntry,
  editTableData,
  editQuery,
  refreshData
} from '@redux/slices/tableDataSlice'
import { showPopup } from '@redux/slices/utilitiesSlice'

// Helpers
import { updateQuery } from '@helpers/format/filterQuery'
import { revalidateContent } from '@helpers/actions/writeEntry'

// Components
import CustomTextButton from '@components/custom/CustomTextButton'
import DeleteConfirmation from '@components/popups/DeleteConfirmation'
import EntryItem from '@components/content/table/items/EntryItem'
import RoleAllow from '@components/content/RoleAllow'

// Context
import { ListContext } from '@components/content/actions/ListEntries'
import Placeholder from '@components/app/Placeholder'
import { getDefaultLocale } from '@helpers/format/locale'

export type TableType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'asset'
  | 'date'
  | 'datetime'
  | 'array'
  | 'currency'

export interface Item {
  key: string
  name: string
  type: TableType
  options?: { key: string; name: string; color?: string }[]
  sortable: boolean
  value: any
}

export interface Entry {
  id: string
  items: Item[]
}

const TableData = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { data, loading }: { data: Entry[]; loading: boolean } =
    useContext(ListContext)

  const user = useAppSelector((state) => state.userData)

  const {
    details: { path: content, i18n },
    listView: { path, dashboard },
    section
  } = useAppSelector((state) => state.staticProps)

  const {
    selected,
    query: { sort }
  } = useAppSelector((state) => state.tableData)

  if (!data || loading)
    return (
      <Placeholder
        template={{
          width: '100%',
          height: 283
        }}
      />
    )

  const selectAll = () => {
    dispatch(
      editTableData({
        selected:
          selected.length == data.length ? [] : data.map((entry) => entry.id)
      })
    )
  }

  const deleteCompleted = async (entries: string[]) => {
    dispatch(refreshData())
    revalidateContent({
      section,
      content,
      key: entries,
      localized: i18n,
      locale: (router.query.locale as string) || getDefaultLocale()
    })
    dispatch(editTableData({ selected: [] }))
  }

  const deleteEntries = (entries: string[]) => {
    dispatch(
      showPopup({
        content: (
          <DeleteConfirmation
            description={`Are you sure you want to delete this entry? ${
              !router.query.locale
                ? 'All locales associated to this entry will also be deleted.'
                : ''
            }`}
            endpoint={path}
            ids={entries}
            onComplete={() => deleteCompleted(entries)}
          />
        )
      })
    )
  }

  const editSort = (key: string) => {
    const newSort = parseNewSort(key)

    dispatch(editQuery({ sort: newSort }))
    updateQuery({
      key: 'sort',
      value: newSort && `${key}:${newSort.order}`,
      router
    })
  }

  const parseNewSort = (
    key: string
  ): { key: string; order: 'asc' | 'desc' } | null => {
    if (!sort || sort.key != key) {
      return { key, order: 'asc' }
    }

    if (sort.order == 'asc') {
      return { key, order: 'desc' }
    }

    return null
  }

  return (
    <Box>
      {selected.length > 0 && (
        <Flex gap={2} paddingTop={2} paddingBottom={2}>
          <Typography variant="omega" fontWeight="bold">
            {selected.length} entry selected
          </Typography>{' '}
          —{' '}
          <CustomTextButton onClick={() => deleteEntries(selected)}>
            <Typography variant="omega" fontWeight="bold" textColor="danger600">
              Delete selected &nbsp;
              <Icon width={3} height={3} color="danger600" as={Trash} />
            </Typography>
          </CustomTextButton>
        </Flex>
      )}
      <Table
        colCount={data.length + 1}
        rowCount={data[0].items.length}
        className="custom-table"
      >
        <Thead>
          <Tr key={data[0]}>
            <Th>
              <BaseCheckbox
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
                value={selected.length == data.length}
                onClick={selectAll}
              />
            </Th>

            {data[0].items.map(({ key, name, type, sortable }) => (
              <Th onClick={() => sortable && editSort(key)} key={key}>
                <Typography variant="sigma">
                  {name}&nbsp;&nbsp;
                  {type == 'string' && (
                    <Icon as={Search} width="0.5rem" height="0.5rem" />
                  )}
                  &nbsp;&nbsp;
                  {sort && key == sort.key ? (
                    <Icon
                      as={sort.order == 'asc' ? CarretUp : CarretDown}
                      width="0.5rem"
                      height="0.5rem"
                    />
                  ) : (
                    sortable && (
                      <Icon as={Filter} width="0.5rem" height="0.5rem" />
                    )
                  )}
                </Typography>
              </Th>
            ))}

            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entry) => (
            <Tr key={entry.id}>
              <Td>
                <BaseCheckbox
                  value={selected.includes(entry.id)}
                  onClick={() => dispatch(selectEntry({ entry: entry.id }))}
                />
              </Td>
              {entry.items.map((item) => (
                <Td key={item.name}>
                  <EntryItem item={item} />
                </Td>
              ))}
              <Td>
                <RoleAllow
                  role={user.role}
                  content={content}
                  permission="write"
                >
                  <Flex gap={4}>
                    {dashboard && (
                      <Link
                        href={`/entry/${section}/${content}/dashboard/${entry.id}`}
                      >
                        <Icon
                          width="0.9rem"
                          height="0.9rem"
                          color="buttonPrimary600"
                          as={Eye}
                        />
                      </Link>
                    )}
                    {!router.query.locale && (
                      <Link
                        href={`/entry/${section}/${content}/clone/${entry.id}`}
                      >
                        <Icon
                          width="0.9rem"
                          height="0.9rem"
                          color="buttonPrimary600"
                          as={Duplicate}
                        />
                      </Link>
                    )}
                    <Link
                      href={`/entry/${section}/${content}/update/${entry.id}`}
                    >
                      <Icon
                        width="0.9rem"
                        height="0.9rem"
                        color="buttonPrimary600"
                        as={Pencil}
                      />
                    </Link>
                    <TextButton onClick={() => deleteEntries([entry.id])}>
                      <Icon
                        width="0.9rem"
                        height="0.9rem"
                        color="buttonPrimary600"
                        as={Trash}
                      />
                    </TextButton>
                  </Flex>
                </RoleAllow>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default TableData
