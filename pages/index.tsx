// Base
import Head from 'next/head'

// Packages
import {
  Typography,
  Link,
  TwoColsLayout,
  Box,
  Flex,
  Divider
} from '@strapi/design-system'
import { Mail } from '@strapi/icons'

// Redux
import { useAppSelector } from '@redux/hooks'

// Components
import Navigation from '@components/app/Navigation'
import Shortcuts from '@components/home/Shortcuts'
import Placeholder from '@components/app/Placeholder'
import MessageEvent from '@components/home/message/MessageEvent'

export default function Home() {
  const user = useAppSelector((state) => state.userData)

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />

        <main>
          <Box padding={10}>
            <Box paddingBottom={4}>
              <Flex gap={2}>
                <Typography variant="alpha">Welcome </Typography>
                <Placeholder
                  loading={!user.details.firstName}
                  template={{
                    width: 81,
                    height: 40
                  }}
                >
                  <Typography variant="alpha">
                    {user.details.firstName}{' '}
                  </Typography>
                </Placeholder>
                <Typography variant="alpha">👋</Typography>
              </Flex>
            </Box>
            <Box paddingBottom={4}>
              <Typography variant="epsilon">
                We hope you are making progress in your work!
              </Typography>
            </Box>

            <Box paddingBottom={7}>
              <Link
                href="mailto:griciustadas.work@gmail.com"
                startIcon={<Mail />}
              >
                Contact developer
              </Link>
            </Box>

            <TwoColsLayout
              startCol={<></>}
              endCol={
                <>
                  <Shortcuts />
                  <Divider />
                  <MessageEvent />
                </>
              }
            />
          </Box>
        </main>
      </div>
    </div>
  )
}
