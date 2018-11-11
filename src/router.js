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

module.exports = ({ path, method }) => {
  path = router[path] || router.notFound
  if (typeof(path) === 'function') return path
  return path[method] || router.methodNotAllowed
}
