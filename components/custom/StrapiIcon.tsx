import dynamic from 'next/dynamic'
import { useState } from 'react'

const StrapiIcon = ({ name }: { name: string }) => {
  const [Icon] = useState(() =>
    dynamic(() => import('@strapi/icons').then((icons) => icons[name]))
  )
  return <Icon />
}

export default StrapiIcon
