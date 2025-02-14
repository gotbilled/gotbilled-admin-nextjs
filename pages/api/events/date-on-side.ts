// Base
import { NextApiRequest, NextApiResponse } from 'next'

// Packages
import { isAxiosError } from 'axios'

// API
import { revalidate } from '../revalidate'

// Helpers
import { publicFetch } from '@helpers/api/contentAPI'
import { getDefaultLocale } from '@helpers/format/locale'

const eventsDataChanged = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const key = await publicFetch({
      url: '/events/data/date-on-side'
    })

    if (key.length > 0) {
      const results = await revalidate({
        section: 'content',
        content: 'events',
        locale: getDefaultLocale(),
        key
      })

      res.json(results)
    } else {
      res.json('Nothing to update')
    }
  } catch (error) {
    if (isAxiosError(error)) {
      return res.json(error.response?.data)
    } else {
      return res
        .status(500)
        .json({ error: 'Something went wrong in the server' })
    }
  }
}

export { eventsDataChanged as default }
