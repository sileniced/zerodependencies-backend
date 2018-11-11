const StringDecoder = require('string_decoder').StringDecoder

module.exports = (req, buffer = '') => new Promise(resolve => {
  const decoder = new StringDecoder('utf-8')

  req.on('data', data => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()
    resolve(buffer)
  })
})