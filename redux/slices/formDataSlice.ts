import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

// Helpers
import { createNestedObject, mergeObjects } from '@helpers/calc/objectParser'
import { isObject } from '@helpers/calc/typeCheck'

interface FormDataState {
  [key: string]: any
}

interface EditFormObject {
  parentPath: string
  data: object
  override?: boolean
}

const initialState: FormDataState = {}

const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    setFormData: (_state, action: PayloadAction<FormDataState>) => ({
      ...action.payload
    }),
    editFormData: (state, action: PayloadAction<FormDataState>) => ({
      ...state,
      ...action.payload
    }),
    editFormObject: (state, action: PayloadAction<EditFormObject>) =>
      editObject({
        state,
        payload: action.payload
      })
  }
})

const editObject = ({
  state,
  payload: { data, parentPath, override }
}: {
  state: FormDataState
  payload: EditFormObject
}) => {
  let updatedData = current(state)

  if (override) {
    if (isObject(data)) {
      const keys = Object.keys(data)

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        updatedData = mergeObjects(
          updatedData,
          createNestedObject(`${parentPath ? `${parentPath}.` : ''}${key}`)
        )
      }
    }
  }

  updatedData = mergeObjects(updatedData, createNestedObject(parentPath, data))

  return updatedData
}

export const { setFormData, editFormData, editFormObject } =
  formDataSlice.actions
export default formDataSlice.reducer
