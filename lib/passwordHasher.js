const crypto = require('crypto')

const generateSalt = length => {
  return crypto.randomBytes(Math.ceil(length / 2))
  .toString('hex')
  .slice(0, length)
}

const sha512 = (password, salt) => {
  const hash = crypto.createHmac('sha512', salt)
  hash.update(password)
  return `${salt}#${hash.digest('hex')}`
}

module.exports.hash = (password, err) => {
  try {
    const salt = generateSalt(16)
    return sha512(password, salt)
  } catch (e) {
    err(e)
  }
}

module.exports.compare = (password, hashed, err) => {
  try {
    const salt = hashed.split('#')[0]
    return sha512(password, salt) === hashed
  } catch (e) {
    err(e)
  }
}