// Base
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Packages
import { Box, Button, Flex, Select, Option } from '@strapi/design-system'

// Interfaces
import { Item, TableType } from './view/EntryData'
import { Info } from '../actions/ListEntries'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Data
import operators from 'public/data/operators.json'

// Components
import FilterForm, {
  FilterOperator,
  FilterOption,
  RawFilter
} from './FilterForm'

// Helpers
import { publicFetch } from '@helpers/api/contentAPI'
import { updateQuery } from '@helpers/format/filterQuery'

interface EditFilter {
  operator?: FilterOperator
  value?: string
}

const Filter = ({
  info,
  showFilter,
  disableQuery
}: {
  info?: Info
  showFilter: boolean
  disableQuery?: boolean
}) => {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const { query } = useAppSelector((state) => state.tableData)

  const staticProps = useAppSelector((state) => state.staticProps as Info)

  const [
    {
      listView: { entry }
    },
    setInfo
  ] = useState<Info>(info || staticProps)

  const [rawFilters, setRawFilters] = useState<RawFilter[]>([])

  useEffect(() => {
    if (query.loaded) {
      loadFilter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.loaded])

  useEffect(() => {
    setInfo(info || staticProps)
  }, [info, staticProps])

  const loadFilter = async () => {
    const filter: RawFilter[] = []

    for (let i = 0; i < query.filter.length; i++) {
      const { key, symbol, value } = query.filter[i]

      const item = entry.find((item: Item) => item.key == key) as Item

      const options = await getOptions(item.options)

      const operator = parseOperator(symbol, value, item.type)

      filter.push({
        key: key,
        type: item.type,
        options,
        operator,
        value
      })
    }

    setRawFilters(filter)
  }

  const parseOperator = (symbol: string, value: string, type: TableType) => {
    switch (value) {
      case '':
        return operators[type].find(({ key }) => key == 'exists')
      case '!':
        return operators[type].find(({ key }) => key == 'not-exists')
      default:
        return operators[type].find((operator) => operator.symbol == symbol)
    }
  }

  const addFilter = async (key: string) => {
    const item = entry.find((item: Item) => item.key == key) as Item

    const options = await getOptions(item.options)

    setRawFilters((prevState) => [
      ...prevState,
      { key, type: item.type, options, value: '' }
    ])
  }

  const editKey = async (filterPosition: number, key: string) => {
    const item = entry.find((item: Item) => item.key == key) as Item

    const options = await getOptions(item.options)

    setRawFilters((prevState) =>
      prevState.map((filter, i) =>
        filterPosition == i
          ? { key, type: item.type, options, value: '' }
          : filter
      )
    )
  }

  const getOptions = async (options?: FilterOption[] | string) => {
    if (options) {
      if (Array.isArray(options)) {
        return options
      } else {
        const fetchedOptions: FilterOption[] = await publicFetch({
          url: options
        })
        return fetchedOptions
      }
    }
  }

  const editFilter = (filterPosition: number, data: EditFilter) => {
    setRawFilters((prevState) =>
      prevState.map((filter, i) =>
        filterPosition == i ? { ...filter, ...data } : filter
      )
    )
  }

  const applyFilter = () => {
    const filteredFilter = rawFilters.filter((filter) => !!filter.operator)

    const formattedFilter = filteredFilter.map((filter) => ({
      key: filter.key,
      symbol: filter.operator?.symbol || '',
      value: filter.value
    }))

    dispatch(editQuery({ filter: formattedFilter }))

    if (!disableQuery) {
      updateQuery({
        key: 'filter',
        value: formattedFilter,
        router
      })
    }
  }

  const clearFilter = () => {
    setRawFilters([])
  }

  const editOperator = (filterPosition: number, key: string) => {
    const operator: FilterOperator | undefined = operators[
      rawFilters[filterPosition].type
    ].find((operator) => operator.key == key)

    if (operator) {
      editFilter(filterPosition, {
        operator,
        value: ''
      })
    }
  }

  const removeFilter = (filterPosition: number) => {
    setRawFilters((prevState) =>
      prevState.filter((_, i) => filterPosition != i)
    )
  }

  if (!showFilter) {
    return null
  }

  return (
    <Box marginTop={4} background="neutral0" shadow="filterShadow" padding={4}>
      <Flex alignItems="flex-start" direction="column" gap={4}>
        <Flex alignItems="flex-start" direction="column" gap={4}>
          <Select
            selectButtonTitle="Carret Down Button"
            placeholder="Select a field..."
            value=""
            onChange={addFilter}
          >
            {entry.map((item: Item) => (
              <Option value={item.key} key={item.key}>
                {item.name}
              </Option>
            ))}
          </Select>
          {rawFilters.map((rawFilter, i) => (
            <FilterForm
              filter={rawFilter}
              onKeyChange={(key: string) => editKey(i, key)}
              onOperatorChange={(key: string) => editOperator(i, key)}
              onValueChange={(value: string) => editFilter(i, { value })}
              onRemove={() => removeFilter(i)}
              entry={entry}
              key={i}
            />
          ))}
        </Flex>
        <Flex gap={4}>
          <Button variant="tertiary" onClick={clearFilter}>
            Clear All
          </Button>
          <Button onClick={applyFilter}>Apply</Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Filter
