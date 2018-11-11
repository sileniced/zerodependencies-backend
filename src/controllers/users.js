const validator = require('../../lib/validator')
const crud = require('../../lib/jsonCrud')

module.exports = {
  get: () => {
  },
  post: async (data, callback) => {

    const columns = ['firstName', 'lastName', 'email', 'password', { boolean: 'tos' }]

    const user = validator(columns, data.payload, console.error)

    const file = await crud.read('users', user.email, console.error)

    if (file) callback({ error: 'user already exist' })

    await crud.create('users', user.email, user, console.error)

    callback(201, user)

  },
  put: () => {
  },
  delete: () => {
  },
}