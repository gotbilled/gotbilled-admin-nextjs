// Base
import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { showMessage } from '@redux/slices/utilitiesSlice'

// Data
import routers from 'public/views/routers.json'

// Helpers
import { authFetch, authModify, publicModify } from '@helpers/api/contentAPI'
import writeEntry, { validateFields } from '@helpers/actions/writeEntry'
import formatEntry from '@helpers/format/formatEntry'
import { getUserHeaders } from '@helpers/api/formatHeaders'

// Components
import Navigation from '@components/app/Navigation'
import ActionBar from '@components/content/form/ActionBar'
import UpdateEntry from '@components/content/actions/UpdateEntry'
import { isString } from '@helpers/calc/typeCheck'
import { getDefaultLocale } from '@helpers/format/locale'

export default function ContentEdit() {
  const { data: session } = useSession()

  const router = useRouter()

  const dispatch = useAppDispatch()
  const {
    details: { titleSingular, path: content, i18n },
    formView: { entry, relations = [], path },
    section
  } = useAppSelector((state) => state.staticProps)

  const data = useAppSelector((state) => state.formData)

  const [loading, setLoading] = useState(false)

  const updateEntry = async () => {
    const fields = [...entry.flat(), ...relations]

    if (!validateFields({ fields, data, dispatch })) {
      return
    }

    const params = {
      url: `${path}`,
      params: { _locale: router.query.local },
      body: data,
      token: session?.jwt
    }

    writeEntry({
      writer: authModify,
      params,
      localized: i18n,
      locale: data.i18n?.locale || getDefaultLocale(),
      section,
      content,
      setLoading,
      callback: afterUpdate,
      dispatch
    })
  }

  useEffect(() => {
    if (router.query.created) {
      showSavedMessage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const afterUpdate = async () => {
    showSavedMessage()
    setLoading(false)
  }

  const showSavedMessage = () => {
    dispatch(
      showMessage({
        type: 'success',
        title: 'Success!',
        text: 'Entry successfuly saved.'
      })
    )
  }

  return (
    <div>
      <Head>
        <title>{`Update ${titleSingular}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <ActionBar action="Update" loading={loading} onSubmit={updateEntry} />

          <UpdateEntry />
        </main>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params

  const session = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production'
  })

  const sections = Object.keys(routers)

  if (
    !params ||
    !params.path ||
    !isString(params.section) ||
    !sections.includes(params.section) ||
    !session?.jwt
  ) {
    return {
      notFound: true
    }
  }

  try {
    const formView = (
      await import(
        `public/views/${params.section}/form/${params.path}/single.json`
      )
    ).default

    const details = routers[params.section as keyof typeof routers].find(
      (router) => router.path === `${params.path}/single`
    )

    if (!details) {
      return {
        notFound: true
      }
    }

    const { createdAt, updatedAt, _id, ...data } = await authFetch({
      url: `${formView.path}`,
      params: { _populate: formView.populate, _locale: context.query.locale },
      token: session.jwt,
      headers: getUserHeaders(context.req)
    })

    formView.entry = await formatEntry(formView.entry)

    return {
      props: {
        initialReduxState: {
          staticProps: {
            entryId: _id,
            details,
            formView,
            information: {
              createdAt,
              updatedAt
            },
            section: params.section
          },
          formData: data
        }
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}
