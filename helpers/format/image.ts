// Interfaces
import { Image } from '@components/content/table/view/AssetData'

interface ImageSrc {
  src: string
  srcSet: string
}

const formatImageSources = (image?: { [key: string]: Image }) => {
  const imageSrc: ImageSrc = { src: '', srcSet: '' }

  if (!image) {
    return imageSrc
  }

  const sizes = Object.entries(image)

  sizes.forEach(([key, value]) => {
    if (key == 'original') {
      imageSrc.src = `${process.env.NEXT_PUBLIC_SERVER_URL}${value.url}`
    } else {
      imageSrc.srcSet += `,${process.env.NEXT_PUBLIC_SERVER_URL}${value.url} ${value.width}w`
    }
  })

  return imageSrc
}

export { formatImageSources }
