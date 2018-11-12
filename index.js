const { createServer } = require('http')
const { createServer: createSecureServer } = require('https')
const requestParser = require('./lib/requestParser')

const { port, securePort, envName, httpsConfig } = require('./config')
const router = require('./src/router')

const app = async (req, res) => {
  const { path, data } = await requestParser(req)

  const callbackHandler = (status = 200, payload = {}) => {
    if (typeof status === 'object') {
      payload = status
      status = 200
    }

    if (payload.user) delete payload.user.password

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(status)
    res.end(JSON.stringify(payload))
  }

  router(path)(data, callbackHandler)
}

require('./lib/jsonDriver').init(['users'])
.then(() => {
  createServer(app).listen(port, () => console.log(`${envName} http: ${port}`))
  createSecureServer(httpsConfig, app).listen(securePort, () => console.log(`${envName} https: ${securePort}`))
})
