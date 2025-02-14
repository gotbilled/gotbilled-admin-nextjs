// Base
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// Packages
import {
  Divider,
  Typography,
  Select,
  Option as SelectOption,
  TextButton
} from '@strapi/design-system'
import { Duplicate } from '@strapi/icons'

// Redux
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { editFormData } from '@redux/slices/formDataSlice'
import { showPopup } from '@redux/slices/utilitiesSlice'

// Components
import EntryBox from '@components/content/form/entry/EntryBox'

// Helpers
import { authFetch } from '@helpers/api/contentAPI'
import { useFetch } from '@helpers/api/useFetch'
import { mergeObjects } from '@helpers/calc/objectParser'
import { getDefaultLocale, supportedLocales } from '@helpers/format/locale'
import LocaleFillConfirmation from '@components/popups/LocaleFillConfirmation'

export interface EntryLocale {
  _id: string
  i18n?: {
    locale: string
  }
}

const Localization = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { data: session } = useSession()

  const {
    entryId,
    section,
    formView: { path, populate },
    details: { path: content }
  } = useAppSelector((state) => state.staticProps)
  const data = useAppSelector((state) => state.formData)

  const { data: entryLocales }: { data?: EntryLocale[] } = useFetch(
    session &&
      (entryId || data.i18n) && {
        url: `${path}/${entryId || data.i18n.default}/locales`,
        token: session.jwt
      },
    authFetch,
    [session?.jwt, data.i18n]
  )

  useEffect(() => {
    if (router.isReady) {
      if (router.query.locale && router.query.default) {
        dispatch(
          editFormData({
            i18n: {
              locale: router.query.locale,
              default: router.query.default
            }
          })
        )

        if (session?.jwt) {
          authFetch({
            url: `/${content}/${router.query.default}/locales/fields`,
            params: {
              _populate: populate
            },
            token: session.jwt
          }).then((defaultData) => {
            const mergedData = mergeObjects(data, defaultData)
            dispatch(editFormData(mergedData))
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, session?.jwt])

  const changeLocale = (locale: string) => {
    if (!entryLocales) {
      return
    }

    const existingLocale = entryLocales.find((entryLocale: EntryLocale) => {
      if (entryLocale.i18n) {
        return entryLocale.i18n.locale == locale
      } else {
        return getDefaultLocale() == locale
      }
    })

    if (content.endsWith('/single')) {
      let query = {}

      if (locale != getDefaultLocale()) {
        query = { locale }
      }

      router.push({
        pathname: `/entry/${section}/${content}`,
        query
      })
    } else if (existingLocale) {
      router.push(`/entry/${section}/${content}/update/${existingLocale._id}`)
    } else {
      router.push({
        pathname: `/entry/${section}/${content}/create`,
        query: {
          locale,
          default: entryId
        }
      })
    }
  }

  const fillLocale = () => {
    if (!entryLocales) {
      return
    }

    dispatch(
      showPopup({
        content: <LocaleFillConfirmation entryLocales={entryLocales} />
      })
    )
  }

  return (
    <div>
      <Divider />
      <EntryBox>
        <Typography variant="pi" fontWeight="bold">
          Internationalization
        </Typography>

        <Select
          label="Locale"
          name="locale"
          value={data.i18n?.locale || getDefaultLocale()}
          onChange={changeLocale}
          disabled={!entryId && !data.i18n}
        >
          {supportedLocales.map((supportedLocale) => (
            <SelectOption
              value={supportedLocale.locale}
              key={supportedLocale.locale}
              startIcon={
                (supportedLocale.default ||
                  entryLocales?.some(
                    (entryLocale: EntryLocale) =>
                      entryLocale.i18n?.locale == supportedLocale.locale
                  )) && (
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '50%',
                      width: '6px',
                      background: 'blue'
                    }}
                  />
                )
              }
            >
              {`${supportedLocale.name} (${supportedLocale.locale})`}
            </SelectOption>
          ))}
        </Select>
        <TextButton onClick={fillLocale} startIcon={<Duplicate />}>
          Fill in from another locale
        </TextButton>
      </EntryBox>
    </div>
  )
}

export default Localization
