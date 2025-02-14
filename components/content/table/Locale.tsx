// Base
import { useRouter } from 'next/router'

// Packages
import { Select, Option as SelectOption } from '@strapi/design-system'

// Redux
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { editQuery } from '@redux/slices/tableDataSlice'

// Helpers
import { updateQuery } from '@helpers/format/filterQuery'
import { getDefaultLocale, supportedLocales } from '@helpers/format/locale'

const Locale = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    query: { locale }
  } = useAppSelector((state) => state.tableData)
  const changeLocale = (locale: string) => {
    const updatedLocale = locale != getDefaultLocale() ? locale : null
    dispatch(editQuery({ locale: updatedLocale }))

    updateQuery({
      key: 'locale',
      value: locale != getDefaultLocale() && locale,
      router
    })
  }

  return (
    <Select
      label=""
      name="locale"
      size="S"
      value={locale || getDefaultLocale()}
      onChange={changeLocale}
    >
      {supportedLocales.map((supportedLocale) => (
        <SelectOption
          value={supportedLocale.locale}
          key={supportedLocale.locale}
        >
          {`${supportedLocale.name} (${supportedLocale.locale})`}
        </SelectOption>
      ))}
    </Select>
  )
}

export default Locale
