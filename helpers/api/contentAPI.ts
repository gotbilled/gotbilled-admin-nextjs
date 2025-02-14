import { RawAxiosRequestHeaders } from 'axios'

import { fetcher, creator, modifier, remover } from '@helpers/api/httpMethods'

interface Read {
  url: string
  params?: object
}

interface AuthRead extends Read {
  token: string
  headers?: RawAxiosRequestHeaders
}

interface Write {
  url: string
  params?: object
  body?: object
  headers?: RawAxiosRequestHeaders
}

interface AuthWrite extends Write {
  token: string
}

interface Remove {
  url: string
}

interface AuthRemove extends Write {
  token: string
}

const publicFetch = ({ url, params }: Read) =>
  fetcher({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    headers: {
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const publicModify = ({ url, params, body }: Write) =>
  modifier({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    body,
    headers: {
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const publicCreate = ({ url, params, body, headers }: Write) =>
  creator({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    body,
    headers: {
      ...headers,
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const publicRemove = ({ url }: Remove) =>
  remover({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    headers: {
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const authFetch = ({ url, params, token, headers }: AuthRead) =>
  fetcher({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const authCreate = ({ url, params, body, token }: AuthWrite) =>
  creator({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const authModify = ({ url, params, body, token }: AuthWrite) =>
  modifier({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    params,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

const authRemove = ({ url, token }: AuthRemove) =>
  remover({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Handshake: process.env.NEXT_PUBLIC_SERVER_HANDSHAKE
    }
  })

export {
  publicFetch,
  publicCreate,
  publicModify,
  publicRemove,
  authFetch,
  authCreate,
  authModify,
  authRemove
}
