// Base
import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// Packages
import { Flex, Button } from '@strapi/design-system'
import { Plus } from '@strapi/icons'

// Redux
import { useAppSelector } from 'redux/hooks'

// Data
import routers from 'public/views/routers.json'

// Components
import Navigation from '@components/app/Navigation'
import ListEntries from '@components/content/actions/ListEntries'
import EntryBox from '@components/content/table/EntryBox'
import Count from '@components/content/table/Count'
import RoleAllow from '@components/content/RoleAllow'
import Placeholder from '@components/app/Placeholder'
import Header from '@components/content/table/Header'
// Intefaces
import TableData, { Item } from '@components/content/table/view/EntryData'

// Helpers
import { formatPaths } from '@helpers/format/formatEntry'
import { publicFetch } from '@helpers/api/contentAPI'
import { isString } from '@helpers/calc/typeCheck'

// Dynamic Components
const ExportData = dynamic(
  () => import('@components/content/table/ExportData'),
  {
    ssr: false,
    loading: () => (
      <Placeholder
        template={{
          width: 38,
          height: 38
        }}
      />
    )
  }
)
const ActionBar = dynamic(() => import('@components/content/table/ActionBar'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: '100%',
        height: 52,
        margin: { top: 16, bottom: 16 }
      }}
    />
  )
})
const Limit = dynamic(() => import('@components/content/table/Limit'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 77,
        height: 38
      }}
    />
  )
})
const Pages = dynamic(() => import('@components/content/table/Pages'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 120,
        height: 38
      }}
    />
  )
})
const Locale = dynamic(() => import('@components/content/table/Locale'), {
  ssr: false,
  loading: () => (
    <Placeholder
      template={{
        width: 134,
        height: 38
      }}
    />
  )
})

export default function ContentList() {
  const router = useRouter()

  const user = useAppSelector((state) => state.userData)

  const {
    details: { title, titleSingular, path: content, i18n },
    section
  } = useAppSelector((state) => state.staticProps)

  const openCreatePage = () => {
    router.push(`/entry/${section}/${content}/create`)
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <Header>
            <Flex gap={2}>
              {i18n && <Locale />}

              <ExportData />

              <Placeholder
                loading={!user.role.name}
                template={{
                  width: 126,
                  height: 40
                }}
              >
                <RoleAllow
                  role={user.role}
                  content={content}
                  permission="write"
                >
                  <Link href={`/entry/${section}/${content}/create`}>
                    <Button startIcon={<Plus />}>Add {titleSingular}</Button>
                  </Link>
                </RoleAllow>
              </Placeholder>
            </Flex>
          </Header>

          <EntryBox>
            <Count />
            <ActionBar />

            <ListEntries addFirstItem={openCreatePage}>
              <TableData />
            </ListEntries>
            <Flex justifyContent="space-between">
              <Limit />
              <Pages />
            </Flex>
          </EntryBox>
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
        prefix: `/entry/${section}/`
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

  const listView = (
    await import(`public/views/${params.section}/list/${params.path}.json`)
  ).default

  const populate = listView.populate || []
  const select = listView.select || []

  for (let i = 0; i < listView.entry.length; i++) {
    const item = listView.entry[i]

    if (item.populate) {
      populate.push(item.populate)
    } else {
      select.push(item.key)
    }

    if (item.options) {
      if (!Array.isArray(item.options)) {
        const fetchedOptions = await publicFetch({ url: item.options })
        item.options = fetchedOptions
      }
    }
  }

  const details = routers[params.section as keyof typeof routers].find(
    (router) => router.path === params.path
  )

  listView.populate = populate
  listView.select = select

  const searchFields = listView.entry
    .filter((item: Item) => item.type == 'string')
    .map((item: Item) => item.key)

  return {
    props: {
      initialReduxState: {
        staticProps: {
          details,
          listView,
          searchFields,
          section: params.section
        }
      }
    }
  }
}
