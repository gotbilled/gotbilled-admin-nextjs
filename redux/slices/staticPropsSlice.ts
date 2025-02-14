import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StaticPropsState {
  [key: string]: any
}

const initialState: StaticPropsState = {}

const staticPropsSlice = createSlice({
  name: 'staticProps',
  initialState,
  reducers: {
    setStaticProps: (_state, action: PayloadAction<StaticPropsState>) => ({
      ...action.payload
    })
  }
})

export const { setStaticProps } = staticPropsSlice.actions
export default staticPropsSlice.reducer
