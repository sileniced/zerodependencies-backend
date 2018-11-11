const fs = require('fs')

const environments = {
  dev: {
    port: 3000,
    securePort: 3001,
    envName: 'dev',
  },
  prod: {
    port: process.env.PORT || 4000,
    securePort: process.env.SECURE_PORT || 4001,
    envName: 'prod',
  },
}

module.exports = {
  ...process.env.NODE_ENV && environments[process.env.NODE_ENV.toLowerCase()] || environments.dev,
  httpsConfig: {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
  },
}