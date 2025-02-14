import { AxiosError } from 'axios'

interface Data {
  [key: string]: string
}

const writeHandler = (e: unknown) => {
  if (e instanceof AxiosError && e.response) {
    const response = e.response.data

    switch (response.code) {
      case 'mongodb_server_11000':
        const entries = Object.keys(response.data)
        return {
          text: 'Duplicate entries:',
          items: entries
        }
      default:
        return { text: response.message }
    }
  } else {
    return { text: 'Something went wrong. Please try again.' }
  }
}

export { writeHandler }
