// Base
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Packages
import {
  Box,
  Flex,
  Typography,
  Button,
  TextButton
} from '@strapi/design-system'
import { ArrowLeft } from '@strapi/icons'

// Redux
import { useAppSelector } from '@redux/hooks'

// Components
import Placeholder from '@components/app/Placeholder'
import RoleAllow from '../RoleAllow'

// Helpers
import { parsePreviewForm } from '@helpers/actions/preview'
import { getDefaultLocale } from '@helpers/format/locale'

const ActionBar = ({
  action,
  loading,
  onSubmit,
  onDelete
}: {
  action: string
  loading: boolean
  onSubmit: Function
  onDelete?: Function
}) => {
  const {
    entryId,
    details: { titleSingular, path },
    section,
    formView: { actions }
  } = useAppSelector((state) => state.staticProps)

  const user = useAppSelector((state) => state.userData)

  const data = useAppSelector((state) => state.formData)

  const [previewLink, setPreviewLink] = useState<string>()

  useEffect(() => {
    const link = !data.i18n?.locale
      ? actions?.preview?.default
      : actions?.preview?.locale
    const locale = data.i18n?.locale || getDefaultLocale()

    setPreviewLink(parsePreviewForm(link, locale, data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.i18n?.locale])

  return (
    <Box paddingTop={8} paddingBottom={8} paddingLeft={6} paddingRight={6}>
      {!path.endsWith('/single') && (
        <Box paddingBottom={2}>
          <Link href={`/entry/${section}/${path}`}>
            <TextButton startIcon={<ArrowLeft />}>BACK</TextButton>
          </Link>
        </Box>
      )}

      <Flex justifyContent="space-between">
        <Typography variant="alpha">
          {action} {titleSingular}
        </Typography>

        <Flex gap={2}>
          {previewLink && action == 'Update' && (
            <Link target="_blank" href={previewLink}>
              <Button variant="secondary">Preview</Button>
            </Link>
          )}
          <Placeholder
            loading={!user.role.name}
            template={{
              width: 75,
              height: 40,
              repeat: 3,
              gap: 2,
              direction: 'row'
            }}
          >
            <RoleAllow role={user.role} content={path} permission="write">
              {onDelete ? (
                <>
                  <Button
                    loading={loading}
                    onClick={onDelete}
                    variant="danger-light"
                  >
                    Delete
                  </Button>
                  {!data.i18n && (
                    <Link
                      href={`/entry/${section}/${path}/clone/${entryId}`}
                      passHref
                      target="_blank"
                    >
                      <Button loading={loading} variant="secondary">
                        Clone
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <></>
              )}
              <Button loading={loading} onClick={onSubmit} variant="default">
                {action}
              </Button>
            </RoleAllow>
          </Placeholder>
        </Flex>
      </Flex>
    </Box>
  )
}

export default ActionBar
