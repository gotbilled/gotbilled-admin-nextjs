// Base
import { ChangeEvent, useEffect, useState } from 'react'

// Packages
import {
  TextInput,
  ToggleInput,
  DatePicker,
  NumberInput
} from '@strapi/design-system'
import { Earth } from '@strapi/icons'
import { JsonEditor } from 'json-edit-react'

// Helpers
import { formatRawDate, formatShortDate } from '@helpers/format/formatDate'

// Interface
import { Item } from '@components/content/form/FormData'

// Components
import RichText from '@components/content/fields/RichText'
import Asset from '@components/content/fields/Asset'
import RepeatableComponent from './component/RepeatableComponent'
import SingleComponent from './component/SingleComponent'
import UUID from '@components/content/fields/UUID'
import DateTimePicker from '@components/content/fields/DateTimePicker'
import SelectOptions from '@components/content/fields/SelectOptions'
import {
  RelationInput,
  Item as RelationItem
} from '@components/content/form/Relation'
import Coordinates from '@components/content/fields/Coordinates'
import LinkInput from '@components/content/fields/LinkInput'
import CurrencyInput from '@components/content/fields/CurrencyInput'
import JSONField from '@components/content/fields/JSONField'

type Input = ChangeEvent<HTMLInputElement>

const EntryItem = ({
  item,
  value,
  parentPath = '',
  reference,
  localized,
  onChange
}: {
  item: Item
  value: any
  parentPath?: string
  reference?: string
  localized: boolean
  onChange: Function
}) => {
  switch (item.type) {
    case 'uuid':
      return (
        <UUID
          label={item.name}
          name={item.key}
          value={value}
          reference={reference}
          localized={item.localized}
          onChange={(value: string) => onChange(value)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'string':
      return (
        <TextInput
          label={item.name}
          name={item.key}
          value={value}
          labelAction={item.localized && <Earth />}
          onChange={(e: Input) => onChange(e.target.value)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'number':
      return (
        <NumberInput
          label={item.name}
          name={item.key}
          value={value}
          labelAction={item.localized && <Earth />}
          onValueChange={(value?: number) => onChange(value || 0)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'currency':
      return (
        <CurrencyInput
          label={item.name}
          name={item.key}
          value={value}
          reference={reference}
          localized={item.localized}
          onChange={(value: string) => onChange(value)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'password':
      return (
        <TextInput
          type="password"
          label={item.name}
          name={item.key}
          value={value || ''}
          labelAction={item.localized && <Earth />}
          onChange={(e: Input) => onChange(e.target.value || null)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'boolean':
      return (
        <ToggleInput
          label={item.name}
          name={item.key}
          onLabel="True"
          offLabel="False"
          checked={value}
          labelAction={item.localized && <Earth />}
          onChange={(e: Input) => onChange(e.target.checked)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'date':
      return (
        <DatePicker
          label={item.name}
          name={item.key}
          placeholder="-- --- ----"
          value={formatShortDate(value)}
          labelAction={item.localized && <Earth />}
          onChange={(value: string) => onChange(formatRawDate(value))}
          selectedDateLabel={(date: string) => date}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'datetime':
      return (
        <DateTimePicker
          label={item.name}
          name={item.key}
          value={value}
          onChange={onChange}
          localized={item.localized}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'asset':
      return (
        <Asset
          label={item.name}
          value={value}
          onChange={onChange}
          localized={item.localized}
          relation={item.relation}
          mimetype={item.mimetype}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'select':
      return (
        <SelectOptions
          label={item.name}
          name={item.key}
          value={value}
          options={item.options}
          onChange={onChange}
          localized={item.localized}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'multiselect':
      return (
        <SelectOptions
          label={item.name}
          name={item.key}
          value={value}
          options={item.options}
          multi={true}
          reference={reference}
          onChange={onChange}
          required={item.required}
          localized={item.localized}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'richText':
      return (
        <RichText
          label={item.name}
          value={value as string}
          onChange={onChange}
          required={item.required}
          localized={item.localized}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'link':
      return (
        <LinkInput
          label={item.name}
          name={item.key}
          value={value}
          localized={item.localized}
          onChange={(value: string) => onChange(value)}
          required={item.required}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'coordinates':
      return (
        <Coordinates
          label={item.name}
          value={value}
          onChange={onChange}
          required={item.required}
          localized={item.localized}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'json':
      return (
        <JSONField
          label={item.name}
          value={value}
          onChange={onChange}
          required={item.required}
        />
      )
    case 'component':
      switch (item.relation) {
        case 'multi':
          return (
            <RepeatableComponent
              item={item}
              value={value}
              dynamic={item.dynamic}
              localized={item.localized}
              parentPath={parentPath}
              onChange={onChange}
              disabled={item.disabled || (!item.localized && !localized)}
            />
          )
        case 'single':
          return (
            <SingleComponent
              item={item}
              value={value}
              localized={item.localized}
              parentPath={parentPath}
              onChange={onChange}
              disabled={item.disabled || (!item.localized && !localized)}
            />
          )
      }
    case 'relation':
      return (
        <RelationInput
          relation={item as unknown as RelationItem}
          data={value}
          onChange={onChange}
          disabled={item.disabled || (!item.localized && !localized)}
        />
      )
    case 'divider':
      return <p>{item.name}</p>
    default:
      return null
  }
}

export default EntryItem
