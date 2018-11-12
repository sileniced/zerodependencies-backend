const em = require('../../lib/entityManager')
const crud = require('../../lib/jsonDriver')

const User = ['firstName', 'lastName', { identifier: 'email' }, { password: 'password' }, { boolean: 'tos' }]

class users {

  constructor() {
    this.name = 'users'
  }

  GET(id) {
    return async (data, callback) => {

      const errs = { 400: [], 500: [] }
      const errCatcher = err => {
        if (typeof(err) === 'string') errs[400].push(err)
        else errs[500].push(err)
      }

      const user = await crud.read(this.name, id, errCatcher)

      if (errs[500].length) callback(500, { errs })
      else if (errs[400].length) callback(400, { errs })
      else callback(200, { user })
    }
  }

  POST() {
    return async (data, callback) => {

      const errs = { 400: [], 500: [] }
      const errCatcher = err => {
        if (typeof(err) === 'string') errs[400].push(err)
        else errs[500].push(err)
      }

      const user = await em.create(this.name, User, data.payload, errCatcher)

      if (!errs[400].length) {
        await em.commit(this.name, User, user, errCatcher)

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