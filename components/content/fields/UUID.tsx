// Base
import { ChangeEvent } from 'react'

// Packages
import { TextInput, IconButton } from '@strapi/design-system'
import { Refresh, Earth } from '@strapi/icons'
import slugify from 'slugify'

const UUID = ({
  label,
  name,
  value,
  reference,
  onChange,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  name: string
  value: string
  reference?: string
  onChange: Function
  localized?: boolean
  required?: boolean
  disabled?: boolean
}) => (
  <TextInput
    label={label}
    name={name}
    value={value}
    labelAction={localized && <Earth />}
    localized={localized}
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    endAction={
      <IconButton
        icon={<Refresh />}
        label="Generate slug"
        noBorder
        onClick={() =>
          reference &&
          onChange(slugify(reference, { lower: true, strict: true }))
        }
      />
    }
    required={required}
    disabled={disabled}
  />
)

export default UUID
