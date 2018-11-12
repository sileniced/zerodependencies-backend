const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const payload = (req, buffer = '') => new Promise(resolve => {
  const decoder = new StringDecoder('utf-8')

  req.on('data', data => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()
    resolve(JSON.parse(buffer))
  })
})

const idCheck = path => {
  const split = path.split('/')
  const id = split.pop()
  if (isNaN(id)) return { base: path, id: null }
  return { base: split.join('/'), id }
}

module.exports = async req => {
  const parsed = url.parse(req.url, true)

  return {
    path: {
      path: idCheck(parsed.pathname.replace(/^\/+|\/+$/g, '')),
      method: req.method.toUpperCase(),
    },
    data: {
      headers: req.headers,
      payload: await payload(req),
    },
  }
}