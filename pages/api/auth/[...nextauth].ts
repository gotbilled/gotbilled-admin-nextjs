// Auth
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Types
import { NextApiRequest, NextApiResponse } from 'next'

// Helpers
import { publicCreate } from '@helpers/api/contentAPI'
import { getUserHeaders } from '@helpers/api/formatHeaders'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        id: 'credentials-password',
        credentials: {},
        async authorize(credentials) {
          const { email, password } = credentials as {
            email: string
            password: string
          }
          try {
            const res = await publicCreate({
              url: '/users/auth/login',
              body: {
                email,
                password
              },
              headers: getUserHeaders(req)
            })

            return res
          } catch {
            throw Error('Provided credentials are incorrect.')
          }
        }
      })
    ],
    session: {
      strategy: 'jwt'
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.jwt = user.token
        }
        return token
      },
      async session({ session, token }) {
        session.jwt = token.jwt
        return session
      }
    },
    pages: {
      error: '/auth/sign-in'
    },
    secret: process.env.NEXTAUTH_SECRET
  })
}
