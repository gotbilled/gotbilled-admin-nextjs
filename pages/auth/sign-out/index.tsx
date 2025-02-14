// Base
import { useEffect } from 'react'
import Head from 'next/head'

// Auth
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

// Helpers
import { authCreate } from '@helpers/api/contentAPI'

export default function SignOut() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status != 'loading') {
      if (session?.jwt) {
        authCreate({
          url: '/members/auth/logout',
          token: session.jwt
        })
      }

      signOut({ callbackUrl: '/auth/sign-in' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <div>
      <Head>
        <title>Sign Out</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
