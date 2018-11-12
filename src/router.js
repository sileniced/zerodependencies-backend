const ping = require('./controllers/ping')
const users = require('./controllers/users')

const standard = {
  notFound: (data, payload) => payload(404),
  methodNotAllowed: (data, payload) => payload(405),
}

const router = {
  ...standard,

  'ping': ping.GET,
  'users': users,
}

module.exports = ({ path: { base, id }, method }) => {
  const pathRoute = router[base] || router.notFound
  if (typeof(pathRoute) === 'function') return pathRoute(id)
  return pathRoute[method](id) || router.methodNotAllowed
}
