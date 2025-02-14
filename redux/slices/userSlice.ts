import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  token: string
  email: string
  details: {
    firstName: string
    lastName: string
  }
  role: {
    name: string
    access: {
      content: string
      permission: 'read' | 'write'
    }[]
  }
}

const initialState: UserState = {
  token: '',
  email: '',
  details: {
    firstName: '',
    lastName: ''
  },
  role: {
    name: '',
    access: []
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<UserState>) => ({
      ...action.payload
    })
  }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
