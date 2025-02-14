// Base
import { useMemo } from 'react'

// Redux-Toolkit
import { configureStore } from '@reduxjs/toolkit'

// Reducers
import utilitiesReducer from './slices/utilitiesSlice'
import staticPropsReducer from './slices/staticPropsSlice'
import formDataReducer from './slices/formDataSlice'
import tableDataReducer from './slices/tableDataSlice'
import userReducer from './slices/userSlice'

type Store = ReturnType<typeof initStore>

let store: Store | undefined

const initStore = (initialState: object) => {
  return configureStore({
    reducer: {
      utilities: utilitiesReducer,
      staticProps: staticPropsReducer,
      formData: formDataReducer,
      tableData: tableDataReducer,
      userData: userReducer
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  })
}

const initializeStore = (preloadedState: object) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export const useStore = (initialState: object) =>
  useMemo(() => initializeStore(initialState), [initialState])

type ConfiguredStore = ReturnType<typeof useStore>
type StoreGetState = ConfiguredStore['getState']
export type RootState = ReturnType<StoreGetState>
export type AppDispatch = ConfiguredStore['dispatch']
