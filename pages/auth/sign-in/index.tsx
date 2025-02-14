// Base
import Form from '@components/auth/sign-in/Form'
import Head from 'next/head'

export default function SignIn() {
  return (
    <div>
      <Head>
        <title>Sign In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="layout">
        <main>
          <Form />
        </main>
      </div>
    </div>
  )
}
