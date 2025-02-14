interface Params {
  [key: string]: string
}

const searchMultipleFields = ({
  conditional,
  fields,
  value,
  operation = ''
}: {
  conditional: string
  fields: string[]
  value: string
  operation?: string
}) => {
  if (!value) {
    return null
  }

  const params: Params = {}

  fields.forEach((field, i) => {
    params[`${conditional}[${i}][${field}]`] = `${operation}${value}`
  })

  return params
}

export { searchMultipleFields }
