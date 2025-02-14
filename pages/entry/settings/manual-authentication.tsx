// Base
import { GetStaticProps } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// Packages
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Typography,
  Box
} from '@strapi/design-system'

// Redux
import { useAppSelector } from 'redux/hooks'

// Data
import routers from 'public/views/routers.json'

// Components
import Navigation from '@components/app/Navigation'
import EntryBox from '@components/content/table/EntryBox'
import Placeholder from '@components/app/Placeholder'
import Header from '@components/content/table/Header'

// Helpers
import { useFetch } from '@helpers/api/useFetch'
import { publicFetch } from '@helpers/api/contentAPI'

interface Endpoint {
  path: string
  methods: string[]
}

export default function ManualAuthentication() {
  const {
    details: { title }
  } = useAppSelector((state) => state.staticProps)

  const { data: endpoints }: { data?: Endpoint[] } = useFetch(
    { url: '/public/endpoints/manual-auth.json' },
    publicFetch,
    []
  )

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <Header />

          <Box paddingTop={4}>
            <EntryBox>
              <Placeholder
                loading={!endpoints}
                template={{
                  width: 870,
                  height: 500
                }}
              >
                <Table colCount={3} rowCount={1}>
                  <Thead>
                    <Tr>
                      <Th>
                        <Typography variant="sigma">Path</Typography>
                      </Th>
                      <Th>
                        <Typography variant="sigma">Methods</Typography>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {endpoints?.map((endpoint, i) => (
                      <Tr key={i}>
                        <Td>
                          <Typography textColor="neutral800">
                            {endpoint.path}
                          </Typography>
                        </Td>
                        <Td>
                          <Typography textColor="neutral800">
                            {endpoint.methods.join(', ')}
                          </Typography>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Placeholder>
            </EntryBox>
          </Box>
        </main>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const details = routers['settings'].find(
    (router) => router.path === 'manual-authentication'
  )

  return {
    props: {
      initialReduxState: {
        staticProps: {
          details
        }
      }
    }
  }
}
