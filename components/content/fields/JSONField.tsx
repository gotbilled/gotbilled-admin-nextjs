// Package
import { JsonData, JsonEditor } from 'json-edit-react'

// Components
import Label from '@components/custom/Label'

const JSONField = ({
  label,
  value,
  onChange,
  required = false
}: {
  label: string
  value: JsonData
  onChange: Function
  required?: boolean
}) => {
  return (
    <div>
      <Label label={label} required={required} />
      <JsonEditor
        data={value}
        setData={(data) => onChange(data)}
        minWidth="100%"
      />
    </div>
  )
}

export default JSONField
