// Base
import { NextApiRequest, NextApiResponse } from 'next'

// Packages
import { AxiosError, RawAxiosRequestHeaders } from 'axios'

// Helpers
import { getRevalidatePaths } from '@helpers/actions/revalidate'
import { fetcher } from '@helpers/api/httpMethods'
import { getUserHeaders } from '@helpers/api/formatHeaders'

// Auth
import { getToken } from 'next-auth/jwt'

interface Data {
  section: string
  content: string
  locale: string
  key: string | string[]
  token?: string
  headers?: RawAxiosRequestHeaders
  localized?: boolean
}

const revalidate = async (data: Data) => {
  const { section, content, key, token, headers, locale, localized } = data

  const revalidatePaths = await getRevalidatePaths({
    section,
    content,
    locale,
    key,
    token,
    headers,
    localized
  })

  if (!revalidatePaths) {
    return 'Revalidation action was not found'
  }

  const { paths, domain } = revalidatePaths

  if (paths.length == 0) {
    return 'Nothing to revalidate'
  }

  console.log(paths)

  const results = await fetcher({
    url: `${domain}/api/revalidate`,
    params: {
      paths,
      secret: process.env.REVALIDATE_SECRET
    }
  })

  return results
}

const fetch = async (req: NextApiRequest, res: NextApiResponse) => {
  const { section, content, locale, localized } = req.query

  if (!section || Array.isArray(section)) {
    return res.status(400).json({ message: 'Missing section' })
  }

  if (!content || Array.isArray(content)) {
    return res.status(400).json({ message: 'Missing content' })
  }

  if (!locale || Array.isArray(locale)) {
    return res.status(400).json({ message: 'Missing locale' })
  }

  const key = req.query['key'] || req.query['key[]']

  if (!key) {
    return res.status(400).json({ message: 'Missing key(s)' })
  }

  try {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === 'production'
    })

    if (!session?.jwt) {
      throw new Error('Missing Authorization')
    }

    const data = await revalidate({
      section,
      content,
      key,
      locale,
      token: session.jwt,
      headers: getUserHeaders(req),
      localized: localized == 'true'
    })

    res.json(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      return res.json(error.response?.data)
    } else {
      return res
        .status(500)
        .json({ error: 'Something went wrong in the server' })
    }
  }
}

export { fetch as default, revalidate }
