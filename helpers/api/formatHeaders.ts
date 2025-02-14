import { IncomingMessage } from 'http'

const getUserHeaders = (req: IncomingMessage) => {
  return {
    'User-Agent': req.headers['user-agent'],
    'X-Forwarded-For': req.socket.remoteAddress
  }
}

export { getUserHeaders }
