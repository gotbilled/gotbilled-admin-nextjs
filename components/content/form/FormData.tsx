// Redux
import { useAppSelector } from '@redux/hooks'

// Interfaces
import { Item as RelationItem } from '@components/content/form/Relation'

// Components
import EntryForm from '@components/content/form/entry/EntryForm'
import { useEffect } from 'react'

export interface Option {
  name?: string
  key: string
}

export interface Item {
  name: string
  key: string
  alt?: string
  options?: Option[]
  entry?: [Item[]]
  primary?: string | string[]
  raw?: boolean
  relation?: 'single' | 'multi'
  relations?: RelationItem[]
  localized?: boolean
  dynamic?: boolean
  mimetype?: string
  reference?: string
  type: string
  required?: boolean
  disabled?: boolean
}

export interface FormView {
  path: string
  entry: [Item[]]
}

const FormData = () => {
  const {
    formView: { entry }
  } = useAppSelector((state) => state.staticProps)

  // const formData = useAppSelector((state) => state.formData)

  // useEffect(() => {
  //   console.log(formData)
  // }, [formData])

  return <EntryForm entry={entry} />
}

export default FormData
