// Base
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'

// Interfaces
import { Item } from '@components/content/table/view/EntryData'
import { editTableData, resetQuery } from '@redux/slices/tableDataSlice'

// Packages
import { EmptyStateLayout, Button, Flex, Box } from '@strapi/design-system'
import { EmptyDocuments, Plus } from '@strapi/icons'

// Helpers
import { useFetch } from '@helpers/api/useFetch'
import { authFetch } from '@helpers/api/contentAPI'
import { getPropByString } from '@helpers/calc/objectParser'
import { searchMultipleFields } from '@helpers/api/endpoints'
import { filterToObject, parseLocale } from '@helpers/format/filterQuery'
// Helpers
import {
  parseFilter,
  parseLimit,
  parsePage,
  parseSearch,
  parseSort
} from '@helpers/format/filterQuery'

// Context
export const ListContext = createContext<{
  data: any
  loading: boolean
}>({
  data: null,
  loading: false
})

interface Data {
  [key: string]: string
}

export interface ListView {
  path: string
  populate?: string[]
  select?: string[]
  filter?: {
    key: string
    symbol: string
    value: string
  }[]
  entry: Item[]
}

export interface Info {
  listView: ListView
  details: {
    title: string
    titleSingular: string
  }
  searchFields: string[]
}

const ListEntries = ({
  info,
  rawData,
  addFirstItem,
  children
}: {
  info?: Info
  rawData?: boolean
  addFirstItem: Function
  children: JSX.Element
}) => {
  const { data: session } = useSession()

  const dispatch = useAppDispatch()
  const router = useRouter()

  const { query, refresh } = useAppSelector((state) => state.tableData)

  const staticProps = useAppSelector((state) => state.staticProps as Info)

  const [
    {
      listView: { path, populate, select, filter = [], entry },
      details: { title, titleSingular },
      searchFields
    },
    setInfo
  ] = useState<Info>(info || staticProps)

  useEffect(() => {
    if (router.isReady) {
      dispatch(
        editTableData({
          query: {
            search: parseSearch(router.query.search),
            filter: parseFilter(router.query),
            limit: parseLimit(router.query.limit),
            page: parsePage(router.query.page),
            sort: parseSort(router.query.sort),
            locale: parseLocale(router.query.locale),
            loaded: true
          }
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, entry])

  useEffect(() => {
    const handleRouteChange = (
      _url: string,
      { shallow }: { shallow: boolean }
    ) => {
      if (!shallow) {
        dispatch(resetQuery())
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const {
    data: fetchedData,
    validating,
    refresh: refreshList
  } = useFetch(
    session &&
      query.loaded && {
        url: path,
        params: {
          _populate: populate,
          _select: select,
          _skip: query.page * query.limit,
          _limit: query.limit,
          _locale: query.locale,
          _sort: query.sort && `${query.sort.key}:${query.sort.order}`,
          ...searchMultipleFields({
            conditional: '_or',
            fields: searchFields,
            value: query.search,
            operation: '~'
          }),
          ...filterToObject([...filter, ...query.filter])
        },
        token: session.jwt
      },
    authFetch,
    [query, session?.jwt]
  )

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setInfo(info || staticProps)
  }, [info, staticProps])

  useEffect(() => {
    if (refresh > 0) {
      refreshList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData.map((data: Data) => formatData(data)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData])

  const formatData = (data: Data) => {
    if (rawData || !entry) {
      return data
    }

    return {
      id: data._id,
      items: [
        ...entry.map((item: Item) => ({
          ...item,
          value: getPropByString(data, item.key)
        }))
      ]
    }
  }

  if (data?.length == 0) {
    return (
      <Box paddingBottom={4}>
        <EmptyStateLayout
          icon={<EmptyDocuments width={160} height={160} />}
          content={`You don't have any ${title} yet...`}
          action={
            <Button variant="secondary" onClick={addFirstItem}>
              <Flex gap={2}>
                <Plus /> Create your first {titleSingular}
              </Flex>
            </Button>
          }
        />
      </Box>
    )
  }

  return (
    <Box paddingBottom={4}>
      <ListContext.Provider value={{ data, loading: validating }}>
        {children}
      </ListContext.Provider>
    </Box>
  )
}

export default ListEntries
