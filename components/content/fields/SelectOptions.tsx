// Base
import { useEffect, useState } from 'react'

// Packages
import { Select, Option as SelectOption } from '@strapi/design-system'
import { Earth } from '@strapi/icons'

// Helpers
import { publicFetch } from '@helpers/api/contentAPI'
import formatDynamic, { isDynamic } from '@helpers/format/formatDynamic'
import { Option } from '../form/FormData'

const SelectOptions = ({
  label,
  name,
  value,
  options,
  multi,
  reference,
  onChange,
  localized,
  required = false,
  disabled = false
}: {
  label: string
  name: string
  options?: Option[] | string
  value: string | string[]
  multi?: boolean
  reference?: string
  onChange: Function
  localized?: boolean | 'populate'
  required?: boolean
  disabled?: boolean
}) => {
  const [forceDisabled, setForceDisabled] = useState(false)

  const [formattedOptions, setFormattedOptions] = useState<Option[]>([])

  useEffect(() => {
    formatOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const formatOptions = async () => {
    if (!options) {
      setFormattedOptions([])
    } else if (Array.isArray(options)) {
      setFormattedOptions(options)
    } else if (!isDynamic(options)) {
      const fetchedOptions = await publicFetch({
        url: options
      })
      setFormattedOptions(fetchedOptions)
    } else if (isDynamic(options) && reference) {
      setForceDisabled(true)

      const url = formatDynamic(options, reference)

      if (url) {
        const fetchedOptions: Option[] = await publicFetch({ url })
        setFormattedOptions(fetchedOptions)

        if (!multi) {
          if (!fetchedOptions.some((option) => option.key == value)) {
            onChange(null)
          }
        } else {
          const options = fetchedOptions.filter((option) =>
            value.includes(option.key)
          )

          onChange(options.map((option) => option.key))
        }

        setForceDisabled(false)
      }
    } else {
      setForceDisabled(true)
    }
  }

  return (
    <Select
      label={label}
      labelAction={localized && <Earth />}
      name={name}
      value={value}
      multi={multi}
      withTags={multi}
      onChange={onChange}
      required={required}
      disabled={forceDisabled || disabled}
    >
      {formattedOptions.map((option) => (
        <SelectOption value={option.key} key={option.key}>
          {option.name || option.key}
        </SelectOption>
      ))}
    </Select>
  )
}

export default SelectOptions
