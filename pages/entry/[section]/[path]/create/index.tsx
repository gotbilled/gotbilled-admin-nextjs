// Base
import { useState } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

// Auth
import { useSession } from 'next-auth/react'

// Redux
import { useAppDispatch, useAppSelector } from 'redux/hooks'

// Data
import routers from 'public/views/routers.json'

// Components
import Navigation from '@components/app/Navigation'
import ActionBar from '@components/content/form/ActionBar'
import CreateEntry from '@components/content/actions/CreateEntry'

// Helpers
import { authCreate } from '@helpers/api/contentAPI'
import writeEntry, { validateFields } from '@helpers/actions/writeEntry'
import formatEntry, {
  formatData,
  formatPaths
} from '@helpers/format/formatEntry'
import { isString } from '@helpers/calc/typeCheck'
import { getDefaultLocale } from '@helpers/format/locale'

interface Data {
  [key: string]: any
}

export default function ContentCreate() {
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

  const createEntry = async () => {
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
      callback: createCompleted,
      dispatch
    })
  }

  const createCompleted = ({ _id }: { _id: string }) => {
    router.push(`/entry/${section}/${content}/update/${_id}?created=true`)
  }

  return (
    <div>
      <Head>
        <title>{`Create ${titleSingular}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <ActionBar action="Create" loading={loading} onSubmit={createEntry} />

          <CreateEntry />
        </main>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sections = Object.keys(routers)

  const paths = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    paths.push(
      ...formatPaths({
        routers: routers[section as keyof typeof routers],
        prefix: `/entry/${section}/`,
        suffix: '/create'
      })
    )
  }

  return {
    paths,
    fallback: false // can also be true or 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params

  const sections = Object.keys(routers)

  if (
    !params ||
    !isString(params.section) ||
    !sections.includes(params.section)
  ) {
    return {
      notFound: true
    }
  }

  const formView = (
    await import(`public/views/${params.section}/form/${params.path}.json`)
  ).default

  const details = routers[params.section as keyof typeof routers].find(
    (router) => router.path === params.path
  )

  const data = formatData(formView.entry)

  formView.entry = await formatEntry(formView.entry)

  return {
    props: {
      initialReduxState: {
        staticProps: { details, formView, section: params.section },
        formData: data
      }
    }
  }
}
