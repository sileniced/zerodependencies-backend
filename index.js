const { createServer } = require('http')
const { createServer: createSecureServer } = require('https')
const requestParser = require('./lib/requestParser')

const { port, securePort, envName, httpsConfig } = require('./config')
const router = require('./src/router')

const app = async (req, res) => {

  const { path, data } = await requestParser(req)

  router(path)(data, (status = 200, payload = {}) => {
    if (typeof status === 'object') {
      payload = status
      status = 200
    }

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(status)
    res.end(JSON.stringify(payload))
  })

}

createServer(app).listen(port, () => console.log(`${envName} http: ${port}`))
createSecureServer(httpsConfig, app).listen(securePort, () => console.log(`${envName} https: ${securePort}`))
