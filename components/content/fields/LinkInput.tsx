// Base
import { ChangeEvent } from 'react'

// Packages
import { TextInput, IconButton } from '@strapi/design-system'
import { ExternalLink, Earth } from '@strapi/icons'

// Validator
import { isURL } from '@helpers/utils/validators'

const LinkInput = ({
  label,
  name,
  value,
  onChange,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  name: string
  value: string
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
        label="Open in new tab"
        icon={<ExternalLink />}
        noBorder
        onClick={() => isURL(value) && window.open(value, '_blank')}
      />
    }
    required={required}
    disabled={disabled}
  />
)

export default LinkInput
