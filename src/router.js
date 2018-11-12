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
}

module.exports = ({ path: { base, id }, method }) => {
  const pathRoute = router[base] || router.notFound
  if (typeof(pathRoute) === 'function') return pathRoute(id)
  return pathRoute[method](id) || router.methodNotAllowed
}
