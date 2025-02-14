// Packages
import { DatePicker, Select, Option, Flex, Icon } from '@strapi/design-system'
import { Earth } from '@strapi/icons'

// Helpers
import {
  formatHours,
  formatMinutes,
  formatShortDate
} from '@helpers/format/formatDate'

const DateTimePicker = ({
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
}) => {
  const changeDateTime = (
    updatedValue: string,
    part: 'date' | 'hours' | 'minutes'
  ) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const date = value ? new Date(value) : today

    switch (part) {
      case 'date':
        const updatedDate = new Date(updatedValue)

        date.setFullYear(
          updatedDate.getFullYear(),
          updatedDate.getMonth(),
          updatedDate.getDate()
        )
        break
      case 'hours':
        date.setHours(parseInt(updatedValue))
        break
      case 'minutes':
        date.setMinutes(parseInt(updatedValue))
        break
    }

    onChange(date)
  }

  return (
    <Flex
      alignItems="flex-end"
      justifyContent="flex-start"
      gap={2}
      className="date-time-picker"
    >
      <DatePicker
        label={label}
        name={name}
        placeholder="-- --- ----"
        value={formatShortDate(value)}
        labelAction={localized && <Earth />}
        onChange={(value: string) => changeDateTime(value, 'date')}
        selectedDateLabel={(date: string) => date}
        required={required}
        disabled={disabled}
      />
      <Select
        selectButtonTitle="Carret Down Button"
        placeholder="--"
        value={formatHours(value)}
        onChange={(value: string) => changeDateTime(value, 'hours')}
        disabled={disabled}
        // startIcon={<Icon as={Clock} color="neutral500" />}
      >
        {[...Array(24)].map((_, i) => (
          <Option value={i.toString()} key={i}>
            {('0' + i).slice(-2)}
          </Option>
        ))}
      </Select>
      <Select
        selectButtonTitle="Carret Down Button"
        placeholder="--"
        value={formatMinutes(value)}
        onChange={(value: string) => changeDateTime(value, 'minutes')}
        disabled={disabled}
        // startIcon={<Icon as={Clock} color="neutral500" />}
      >
        {[...Array(60)].map((_, i) => (
          <Option value={i.toString()} key={i}>
            {('0' + i).slice(-2)}
          </Option>
        ))}
      </Select>
    </Flex>
  )
}

export default DateTimePicker
