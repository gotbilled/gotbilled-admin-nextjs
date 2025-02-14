import { useState, useEffect } from 'react'

interface History {
  key: number
  data: any
}

/**
 * Custom hook which simplifies data fetching
 * @param {Object} params - URL prameters that will be sent with the request
 * @param {string} fetcher - Async function that accepts the params and returns the data
 * @param {Array} [listeners=[]] - Array of dependencies which executes fetcher only if the dependencies have changed between renderings. By default it will run once
 */
const useFetch = (
  params: Object | null,
  fetcher: Function,
  listeners: any[] = []
) => {
  const [history, setHistory] = useState<History[]>([])
  const [data, setData] = useState<any | null>(null)
  const [validating, setValidating] = useState(true)
  const [activeKey, setActiveKey] = useState<number>()

  const [response, setResponse] = useState<any>()

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, listeners)

  useEffect(() => {
    if (response) {
      if (response.key == activeKey) {
        setData(response.data)
        setHistory((prevState) => [
          ...prevState,
          { key: response.key, data: response.data }
        ])
      }
    }
  }, [response])

  useEffect(() => {
    if (data) {
      setValidating(false)
    }
  }, [data])

  const fetchData = async (force = false) => {
    if (!params || !fetcher) return

    const key = getKey({ params, fetcher })

    setActiveKey(key)

    const record = history.find((record) => record.key === key)

    setData(null)

    if (record && !force) {
      setData(record.data)
      return
    }

    setValidating(true)

    fetcher(params).then((data: Object) => {
      setResponse({ key, data })
    })
  }

  const refresh = () => {
    setHistory([])
    fetchData(true)
  }

  return { data, validating, refresh }
}

const useFetchInfinite = (
  params: Function,
  fetcher: Function,
  listeners: any[] = []
) => {
  const [data, setData] = useState<any | null>(null)
  const [page, setPage] = useState(0)
  const [loadMoreData, setLoadMoreData] = useState(false)
  const [cleanListener, setCleanListener] = useState([...listeners, page])

  const { data: fetchedData, validating } = useFetch(
    params(page),
    fetcher,
    cleanListener
  )

  useEffect(() => {
    if (validating && !loadMoreData) {
      setData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validating])

  useEffect(() => {
    if (!params(page) || !fetcher) return

    if (!loadMoreData) {
      setPage(0)
      setCleanListener([...listeners, 0])
    } else {
      setCleanListener([...listeners, page])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...listeners, page])

  useEffect(() => {
    if (fetchedData) {
      if (loadMoreData) {
        setData((prevState: any) => [...prevState, fetchedData])
        setLoadMoreData(false)
      } else {
        setData([fetchedData])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData])

  const loadMore = () => {
    setLoadMoreData(true)
    setPage((prevState) => prevState + 1)
  }

  return { data, validating, page, loadMore }
}

const getKey = (data: Object) => hashCode(JSON.stringify(data))

const hashCode = (data: string) => {
  var hash = 0,
    i,
    chr
  if (data.length === 0) return hash
  for (i = 0; i < data.length; i++) {
    chr = data.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export { useFetch, useFetchInfinite }
