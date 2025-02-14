// Base
import dynamic from 'next/dynamic'
import Head from 'next/head'

// Components
import Navigation from '@components/app/Navigation'
import Placeholder from '@components/app/Placeholder'

// Dynamic Components
const SettingsNavigation = dynamic(
  () => import('@components/settings/SettingsNavigation'),
  {
    ssr: false,
    loading: () => (
      <Placeholder
        template={{
          width: 231,
          height: '100vh'
        }}
      />
    )
  }
)

export default function Home() {
  return (
    <div>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <Navigation />
        <SettingsNavigation />

        <main></main>
      </div>
    </div>
  )
}
