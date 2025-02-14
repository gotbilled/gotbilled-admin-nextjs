import type { NextRequest } from 'next/server'

import authSignIn from '@middlewares/auth/sign-in'
import session from '@middlewares/session'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname == '/auth/sign-in') {
    return await authSignIn(request)
  } else {
    return await session(request)
  }
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
}
