const em = require('../../lib/entityManager')
const crud = require('../../lib/jsonDriver')

const User = ['firstName', 'lastName', { identifier: 'email' }, { password: 'password' }, { boolean: 'tos' }]

class users {

  constructor() {
    this.name = 'users'
  }

  GET(props) {
    return async (data, err) => ({
      status: 200,
      payload: { user: await crud.read(this.name, props.id, err) },
    })
  }

  POST() {
    return async (data, err) => {
      const errs = []
      const errCatcher = error => {
        if (typeof(error) === 'string') errs.push(error)
        err(error)
      }

      const user = await em.create(this.name, User, data.payload, errCatcher)
      if (!errs.length) await em.commit(this.name, User, user, err)

      return { status: 200, payload: { user } }
    }
  }

  PUT() {

  }

  DELETE() {

  }
}

module
  .exports = new users