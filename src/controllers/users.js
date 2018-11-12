const entity = require('../../lib/entityCreator')
const validator = require('../../lib/validator')
const crud = require('../../lib/jsonDriver')

const { hash, compare } = require('../../lib/passwordHasher')

class users {

  GET(id) {
    return async (data, callback) => {
      const err = []
      const errCatcher = err => {
        err.push(err)
      }
      if (!id) {

      }
    }
  }

  POST() {
    return async (data, callback) => {

      const errs = { 400: [], 500: [] }
      const errCatcher = err => {
        if (typeof(err) === 'string') errs[400].push(err)
        else errs[500].push(err)
      }

      const User = ['firstName', 'lastName', 'email', 'password', { boolean: 'tos' }]
      const valid = validator(User, data.payload, errCatcher)

      if (!await crud.isUnique('users', valid.email)) errCatcher('user already exists')
      if (!errs[400].length) {

        const user = await entity.create('users', valid, errCatcher)
        user.password = hash(user.password, errCatcher)
        await crud.create('users', user.id, user, errCatcher)

        if (errs[500].length) callback(500, { errs })
        else callback(201, { user })
      } else callback(400, { errs })

    }
  }

  PUT() {

  }

  DELETE() {

  }
}

module.exports = new users