const validator = require('../../lib/validator')
const crud = require('../../lib/jsonCrud')

class users {

  async GET(data, callback) {
    const errors = []
    const errorCollector = err => {
      errors.push(err)
    }


  }

  async POST(data, callback) {

    const errors = { 400: [], 500: [] }
    const errorCollector = err => {
      if (typeof(err) === 'string') errors[400].push(err)
      else errors[500].push(err)
    }

    const columns = ['firstName', 'lastName', 'email', 'password', { boolean: 'tos' }]
    const user = validator(columns, data.payload, errorCollector)

    if (crud.exists('users', user.email, errorCollector)) errorCollector('user already exists')
    else await crud.create('users', user.email, user, errorCollector)

    if (errors[500].length) callback(500, errors[500])
    else if (errors[400].length) callback(400, errors[400])
    else callback(201, user)

  }

  PUT() {

  }

  DELETE() {

  }
}

module.exports = new users