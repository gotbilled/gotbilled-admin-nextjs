// Base
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Packages
import { Flex, Button, Searchbar, Typography } from '@strapi/design-system'
import { Filter } from '@strapi/icons'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Helpers
import { updateQuery } from '@helpers/format/filterQuery'

const Search = ({
  disableQuery,
  setShowFilter
}: {
  disableQuery?: boolean
  setShowFilter: Function
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [input, setInput] = useState('')
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

  const { query } = useAppSelector((state) => state.tableData)

  useEffect(() => {
    if (query.loaded) {
      setInput(query.search)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.loaded])

  const editSearch = (input: string) => {
    setInput(input)
    searchEntries(input)
  }

  const searchEntries = (input: string) => {
    if (input) {
      clearTimeout(searchTimeout)

      const timeout = setTimeout(() => {
        updateSearch(input)
      }, 500)

      setSearchTimeout(timeout)
    } else {
      updateSearch(input)
      clearTimeout(searchTimeout)
    }
  }

  const updateSearch = (search: string) => {
    dispatch(editQuery({ search }))

    if (!disableQuery) {
      updateQuery({
        key: 'search',
        value: search,
        router
      })
    }
  }

  return (
    <Searchbar
      name="searchbar"
      onClear={() => editSearch('')}
      value={input}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        editSearch(e.target.value)
      }
      clearLabel="Clearing the search"
      placeholder="Search for an entry"
      endAction={
        <Flex paddingTop={2} paddingBottom={2} gap={2}>
          <Button
            variant={query.filter.length == 0 ? 'tertiary' : 'secondary'}
            size="S"
            startIcon={<Filter />}
            onClick={setShowFilter}
          >
            Filters
          </Button>
        </Flex>
      }
    >
      Searching for an entry
    </Searchbar>
  )
}

export default Search
