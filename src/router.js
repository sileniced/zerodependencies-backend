const pathProps = require('../lib/pathProps')

const ping = require('./controllers/ping')
const users = require('./controllers/users')

const errorResponses = {
  notFound: () => () => ({ status: 404 }),
  methodNotAllowed: () => () => ({ status: 405 }),
}

const router = {
  ...errorResponses,

  'ping': ping.GET,
  'users': users,
  'users/:id': users,
  'foo/:fooSlug/bar/:barId': ping.PROPS,
  'foo/ding/bar/:barId': ping.PROPS,
}

module.exports = ({ path, method }) => {
  const { base, props } = pathProps(path, router)
  const pathRoute = router[base] || router.notFound
  if (typeof(pathRoute) === 'function') return pathRoute(props)
  return pathRoute[method](props) || router.methodNotAllowed
}
