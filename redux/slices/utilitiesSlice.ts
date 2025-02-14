import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ShowMessage {
  type: 'success' | 'danger' | 'default' | 'warning'
  title: 'Error!' | 'Attention!' | 'Success!'
  text: string | string[]
  items?: string[]
}

interface Message {
  type: 'success' | 'danger' | 'default' | 'warning'
  title: 'Error!' | 'Attention!' | 'Success!'
  text: string | string[]
  items: string[]
}

interface MessageState extends Message {
  show: boolean
}

interface Popup {
  content: JSX.Element
}

interface UtilitiesState {
  disableScroll: boolean
  message: MessageState
  popups: Popup[]
}

const initialState: UtilitiesState = {
  disableScroll: false,
  message: {
    type: 'success',
    title: 'Success!',
    text: '',
    items: [],
    show: false
  },
  popups: []
}

const utilitiesSlice = createSlice({
  name: 'utilities',
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<ShowMessage>) => ({
      ...state,
      message: {
        items: [],
        ...action.payload,
        show: true
      }
    }),
    hideMessage: (state) => ({
      ...state,
      message: {
        ...state.message,
        show: false
      }
    }),
    showPopup: (state, action: PayloadAction<Popup>) => ({
      ...state,
      popups: [...state.popups, action.payload]
    }),
    hidePopup: (state) => ({
      ...state,
      popups: state.popups.length > 0 ? state.popups.slice(0, -1) : []
    })
  }
})

export const { showMessage, hideMessage, showPopup, hidePopup } =
  utilitiesSlice.actions
export default utilitiesSlice.reducer
