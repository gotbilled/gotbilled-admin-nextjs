// Base
import { useEffect, useState } from 'react'

// Packages
import { NumberInput } from '@strapi/design-system'
import { Earth } from '@strapi/icons'

// Helpers
import { getCurrency, getDefaultCurrency } from '@helpers/format/formatCurrency'

const CurrencyInput = ({
  label,
  name,
  value,
  onChange,
  localized,
  reference,
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
}) => {
  const [currency, setCurrency] = useState(getDefaultCurrency()?.symbol || '-')

  useEffect(() => {
    if (reference) {
      getCurrency(reference).then(
        (currency) => currency && setCurrency(currency.symbol)
      )
    }
  }, [reference])

  return (
    <NumberInput
      label={label}
      name={name}
      value={value}
      startAction={<p>{currency}</p>}
      labelAction={localized && <Earth />}
      onValueChange={(value?: number) => onChange(value || 0)}
      required={required}
      disabled={disabled}
    />
  )
}

export default CurrencyInput
