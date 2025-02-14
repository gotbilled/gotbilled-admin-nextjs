const formatLongDate = (date: string) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatShortDate = (date: string) => {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatRawDate = (date: string) => {
  if (!date) {
    return ''
  }

  const parsedDate = new Date(date)

  return `${parsedDate.getFullYear()}-${pad(
    parsedDate.getMonth() + 1,
    2
  )}-${pad(parsedDate.getDate(), 2)}`
}

const formatHours = (date: string) => {
  if (!date) {
    return ''
  }

  return new Date(date).getHours().toString()
}

const formatMinutes = (date: string) => {
  if (!date) {
    return ''
  }

  return new Date(date).getMinutes().toString()
}

const pad = (rawNum: number, size: number) => {
  let num = rawNum.toString()
  while (num.length < size) num = '0' + num
  return num
}

export {
  formatLongDate,
  formatShortDate,
  formatHours,
  formatMinutes,
  formatRawDate
}
