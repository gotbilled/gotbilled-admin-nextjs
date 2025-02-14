// Base
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

// Packages
import {
  Button,
  Typography,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Flex,
  Icon,
  Select,
  Option as SelectOption,
  Box
} from '@strapi/design-system'
import { ExclamationMarkCircle } from '@strapi/icons'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { hidePopup } from '@redux/slices/utilitiesSlice'
import { editFormData } from '@redux/slices/formDataSlice'

// Interfaces
import { EntryLocale } from '@components/content/form/Localization'

// Helpers
import {
  getDefaultLocale,
  getLocalizedFields,
  supportedLocales
} from '@helpers/format/locale'
import { authFetch } from '@helpers/api/contentAPI'
import { createNestedObject, mergeObjects } from '@helpers/calc/objectParser'

interface AvailableLocale {
  _id: string
  name: string
  locale: string
  default?: boolean
}

const LocaleFillConfirmation = ({
  entryLocales
}: {
  entryLocales: EntryLocale[]
}) => {
  const dispatch = useAppDispatch()

  const { data: session } = useSession()

  const { formView, details } = useAppSelector((state) => state.staticProps)
  const data = useAppSelector((state) => state.formData)

  const [loading, setLoading] = useState(false)
  const [availableLocales, setAvailableLocales] = useState<AvailableLocale[]>(
    []
  )
  const [localizedFields, setLocalizedFields] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedLocale, setSelectedLocale] = useState<{
    locale: string
    _id: string
  }>()

  useEffect(() => {
    const matchedLocales: AvailableLocale[] = []
    entryLocales.forEach((entryLocale) => {
      const matchedLocale = supportedLocales.find(
        (supportedLocale) =>
          (!entryLocale.i18n && supportedLocale.default) ||
          supportedLocale.locale == entryLocale.i18n?.locale
      )

      if (matchedLocale) {
        matchedLocales.push({
          _id: entryLocale._id,
          ...matchedLocale
        })
      }
    })

    setAvailableLocales(matchedLocales)
  }, [entryLocales])

  useEffect(() => {
    setLocalizedFields(getLocalizedFields(formView.entry))
  }, [formView.entry])

  const closePopup = () => {
    if (!loading) {
      dispatch(hidePopup())
    }
  }

  const fillAndConfirm = async () => {
    if (session?.jwt && selectedLocale) {
      setLoading(true)

      let url = formView.path

      if (!details.path.endsWith('/single')) {
        url += `/${selectedLocale._id}`
      } else if (getDefaultLocale() != selectedLocale.locale) {
        url += `?_locale=${selectedLocale.locale}`
      }

      const { i18n, ...localeData } = await authFetch({
        url,
        params: {
          _select: selectedFields,
          _populate: formView.populate.filter((populatedField: string) =>
            selectedFields.some((selectedField) =>
              populatedField.startsWith(selectedField)
            )
          ),
          _clear: true
        },
        token: session.jwt
      })

      let sanitizedData = data

      for (let i = 0; i < selectedFields.length; i++) {
        const selectedField = selectedFields[i]

        sanitizedData = mergeObjects(
          sanitizedData,
          createNestedObject(selectedField)
        )
      }

      const mergedData = mergeObjects(sanitizedData, localeData)
      dispatch(editFormData(mergedData))

      dispatch(hidePopup())
      setLoading(false)
    }
  }

  const handleLocaleSelect = (selectedId: string) => {
    const selected = availableLocales.find(
      (availableLocale) => availableLocale._id == selectedId
    )

    if (selected) {
      setSelectedLocale(selected)
    }
  }

  return (
    <ModalLayout onClose={closePopup} labelledBy="delete">
      <ModalHeader>
        <Typography variant="beta">Please confirm</Typography>
      </ModalHeader>
      <ModalBody>
        <Flex direction="column" gap={4}>
          <Icon
            width={6}
            height={6}
            color="danger600"
            as={ExclamationMarkCircle}
          />
          <Typography variant="omega" textColor="danger600">
            Your selected fields will be erased and filled with the content of
            selected locale.
          </Typography>
        </Flex>
        <Box>
          <Box paddingTop={4} paddingBottom={4}>
            <Select
              label="Fields"
              name="fields"
              value={selectedFields}
              multi={true}
              withTags={true}
              onChange={setSelectedFields}
            >
              {localizedFields.map((localizedField) => (
                <SelectOption value={localizedField} key={localizedField}>
                  {localizedField}
                </SelectOption>
              ))}
            </Select>
          </Box>
          <Select
            label="Locale"
            name="locale"
            value={selectedLocale?._id}
            onChange={handleLocaleSelect}
          >
            {availableLocales.map((availableLocale) => (
              <SelectOption
                value={availableLocale._id}
                key={availableLocale.locale}
              >
                {`${availableLocale.name} (${availableLocale.locale})`}
              </SelectOption>
            ))}
          </Select>
        </Box>
      </ModalBody>
      <ModalFooter
        startActions={
          <Button loading={loading} onClick={closePopup} variant="tertiary">
            No, Cancel
          </Button>
        }
        endActions={
          <Button
            loading={loading}
            onClick={fillAndConfirm}
            disabled={!selectedLocale || !selectedFields.length}
          >
            Yes, fill in
          </Button>
        }
      />
    </ModalLayout>
  )
}

export default LocaleFillConfirmation
