import { getDefaultLocale } from '@helpers/format/locale'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SelectEntry {
  entry: string
}

interface EditQuery {
  search?: string
  filter?: {
    key: string
    symbol: string
    value: string
  }[]
  page?: number
  limit?: number
  locale?: string | null
  sort?: {
    key: string
    order: 'asc' | 'desc'
  } | null
}

interface EditTableData {
  selected?: string[]
  count?: number
  query?: {
    search: string
    filter: {
      key: string
      symbol: string
      value: string
    }[]
    page: number
    limit: number
    locale: string | null
    sort: {
      key: string
      order: 'asc' | 'desc'
    } | null
    loaded: boolean
  }
  refresh?: number
}

interface TableDataState {
  selected: string[]
  count: number
  query: {
    search: string
    filter: {
      key: string
      symbol: string
      value: string
    }[]
    page: number
    limit: number
    locale: string | null
    sort: {
      key: string
      order: 'asc' | 'desc'
    } | null
    loaded: boolean
  }
  refresh: number
}

export const initialState: TableDataState = {
  selected: [],
  count: 0,
  query: {
    search: '',
    filter: [],
    page: 0,
    limit: 10,
    locale: null,
    sort: null,
    loaded: false
  },
  refresh: 0
}

const tableDataSlice = createSlice({
  name: 'tableData',
  initialState,
  reducers: {
    editTableData: (state, action: PayloadAction<EditTableData>) => ({
      ...state,
      ...action.payload
    }),
    editQuery: (state, action: PayloadAction<EditQuery>) => ({
      ...state,
      query: {
        ...state.query,
        page: 0,
        ...action.payload
      }
    }),
    selectEntry: (state, action: PayloadAction<SelectEntry>) => ({
      ...state,
      selected: updateSelected(state, action.payload.entry)
    }),
    refreshData: (state) => ({
      ...state,
      refresh: state.refresh + 1
    }),
    resetQuery: (state) => ({
      ...state,
      query: initialState.query
    })
  }
})

const updateSelected = (state: TableDataState, entry: string) => {
  if (state.selected.includes(entry)) {
    return state.selected.filter((selectedEntry) => selectedEntry != entry)
  } else {
    return [...state.selected, entry]
  }
}

export const {
  editTableData,
  selectEntry,
  editQuery,
  refreshData,
  resetQuery
} = tableDataSlice.actions
export default tableDataSlice.reducer
