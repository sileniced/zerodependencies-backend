const { createServer } = require('http')
const { createServer: createSecureServer } = require('https')
const requestParser = require('./lib/requestParser')

const { port, securePort, envName, httpsConfig } = require('./config')
const router = require('./src/router')

const app = async (req, res) => {

  const errs = { 400: [], 500: [] }
  const errCatcher = error => {
    if (typeof(error) === 'string') errs[400].push(error)
    else errs[500].push(error)
  }

  const { path, data } = await requestParser(req)
  const response = await router(path)(data, errCatcher)

  const status = errs[500].length ? 500 : (errs[400].length ? 400 : response.status)
  const payload = [400, 500].indexOf(status) > -1 ? { errs } : response.payload
  if (payload.user) delete payload.user.password

  res.setHeader('Content-Type', 'application/json')
  res.writeHead(status)
  res.end(JSON.stringify(payload))
}

require('./lib/jsonDriver').init(['users'])
.then(() => {
  createServer(app).listen(port, () => console.log(`${envName} http: ${port}`))
  createSecureServer(httpsConfig, app).listen(securePort, () => console.log(`${envName} https: ${securePort}`))
})
