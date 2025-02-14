// Base
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch, useAppSelector } from 'redux/hooks'

// Data
import routers from 'public/views/routers.json'

// Helpers
import { authCreate, authFetch } from '@helpers/api/contentAPI'
import writeEntry, { validateFields } from '@helpers/actions/writeEntry'
import formatEntry, { formatData } from '@helpers/format/formatEntry'
import { getUserHeaders } from '@helpers/api/formatHeaders'

// Components
import Navigation from '@components/app/Navigation'
import ActionBar from '@components/content/form/ActionBar'
import UpdateEntry from '@components/content/actions/UpdateEntry'
import { mergeObjects } from '@helpers/calc/objectParser'
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

  const cloneEntry = async () => {
    const fields = [...entry.flat(), ...relations]

    if (!validateFields({ fields, data, dispatch })) {
      return
    }

    const params = {
      url: `${path}`,
      body: data,
      token: session?.jwt
    }

    writeEntry({
      writer: authCreate,
      params,
      localized: i18n,
      locale: data.i18n?.locale || getDefaultLocale(),
      section,
      content,
      setLoading,
      callback: cloneCompleted,
      dispatch
    })
  }

  const cloneCompleted = ({ _id }: { _id: string }) => {
    router.push(`/entry/${section}/${content}/update/${_id}?created=true`)
  }

  return (
    <div>
      <Head>
        <title>{`Clone ${titleSingular}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <ActionBar action="Clone" loading={loading} onSubmit={cloneEntry} />

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
    !params.id ||
    Array.isArray(params.id) ||
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
      await import(`public/views/${params.section}/form/${params.path}.json`)
    ).default

    const details = routers[params.section as keyof typeof routers].find(
      (router) => router.path === params.path
    )

    const entryId = params.id
    const path = (formView.path as string).replace(':id', entryId)
    const { createdAt, updatedAt, ...data } = await authFetch({
      url: `${path}/${entryId}`,
      params: { _populate: formView.populate, _clear: true },
      token: session.jwt,
      headers: getUserHeaders(context.req)
    })

    const defaultData = formatData(formView.entry)

    formView.entry = await formatEntry(formView.entry)

    return {
      props: {
        initialReduxState: {
          staticProps: {
            details,
            formView,
            entryId,
            information: {
              createdAt,
              updatedAt
            },
            section: params.section
          },
          formData: mergeObjects(defaultData, data)
        }
      }
    }
  } catch {
    return {
      notFound: true
    }
  }
}
