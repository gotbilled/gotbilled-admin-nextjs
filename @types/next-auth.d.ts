import NextAuth, { Account, DefaultSession, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    jwt?: string
  }
  interface User {
    token?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    jwt?: string
  }
}
