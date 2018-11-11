const url = require('url')
const payloadPromise = require('./payloadPromise')

module.exports = async req => {
  const parsed = url.parse(req.url, true)

  return {
    path: {
      path: parsed.pathname.replace(/^\/+|\/+$/g, ''),
      method: req.method.toUpperCase()
    },
    data: {
      headers: req.headers,
      query: parsed.query,
      payload: await payloadPromise(req),
    },
  }
}