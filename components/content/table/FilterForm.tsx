// Base
import { ChangeEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Packages
import {
  Box,
  Button,
  Flex,
  Select,
  Option,
  IconButton,
  TextInput,
  NumberInput,
  FieldInput,
  DatePicker
} from '@strapi/design-system'
import { MinusOutlined } from '@strapi/icons'

// Interfaces
import { Item, TableType } from './view/EntryData'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Data
import operators from 'public/data/operators.json'

// Components
import DateTimePicker from '../fields/DateTimePicker'

// Helpers
import { formatRawDate, formatShortDate } from '@helpers/format/formatDate'

type Input = ChangeEvent<HTMLInputElement>

export interface FilterOption {
  key: string
  name: string
}

export interface FilterOperator {
  key: string
  symbol: string
  input?: string
}

export interface RawFilter {
  key: string
  type: TableType
  operator?: FilterOperator
  options?: FilterOption[]
  value: string
}

const FilterForm = ({
  filter,
  onKeyChange,
  onOperatorChange,
  onValueChange,
  onRemove,
  entry
}: {
  filter: RawFilter
  onKeyChange: Function
  onOperatorChange: Function
  onValueChange: Function
  onRemove: Function
  entry: Item[]
}) => {
  return (
    <Flex gap={4}>
      <IconButton
        onClick={onRemove}
        label="Remove Filter"
        icon={<MinusOutlined />}
        noBorder
      />

      <Select
        selectButtonTitle="Carret Down Button"
        placeholder="Select a field..."
        value={filter.key}
        onChange={onKeyChange}
      >
        {entry.map((item: Item) => (
          <Option value={item.key} key={item.key}>
            {item.name}
          </Option>
        ))}
      </Select>
      <Select
        selectButtonTitle="Carret Down Button"
        placeholder="Filter by..."
        value={filter.operator?.key}
        onChange={onOperatorChange}
      >
        {operators[filter.type].map((operator, i) => (
          <Option value={operator.key} key={i}>
            {operator.name}
          </Option>
        ))}
      </Select>
      <ValueInput
        filter={filter}
        input={filter.operator?.input}
        value={filter.value}
        onChange={onValueChange}
      />
    </Flex>
  )
}

const ValueInput = ({
  filter,
  input,
  value,
  onChange
}: {
  filter: RawFilter
  input?: string
  value: string
  onChange: Function
}) => {
  switch (input) {
    case 'string':
      return (
        <TextInput
          aria-label="Value"
          name="Value"
          value={value}
          onChange={(e: Input) => onChange(e.target.value)}
        />
      )
    case 'number':
      return (
        <FieldInput
          type="number"
          aria-label="Value"
          name="Value"
          value={value}
          onChange={(e: Input) => onChange(e.target.value)}
        />
      )
    case 'boolean':
      return (
        <Select
          aria-label="Value"
          name="Value"
          value={value}
          onChange={(value: string) => onChange(value)}
        >
          <Option value="false">False</Option>
          <Option value="true">True</Option>
        </Select>
      )
    case 'date':
      return (
        <DatePicker
          label=" "
          name="Value"
          value={formatShortDate(value)}
          onChange={(value: string) => onChange(formatRawDate(value))}
          placeholder="-- --- ----"
          selectedDateLabel={(date: string) => date}
        />
      )
    case 'datetime':
      return (
        <DateTimePicker
          label=" "
          name="Value"
          value={value}
          onChange={onChange}
        />
      )
    case 'select':
      return (
        <Select
          selectButtonTitle="Carret Down Button"
          placeholder="Select a field..."
          value={value}
          onChange={(value: string) => onChange(value)}
        >
          {filter.options?.map((option) => (
            <Option value={option.key} key={option.key}>
              {option.name}
            </Option>
          ))}
        </Select>
      )
    default:
      return null
  }
}

export default FilterForm
