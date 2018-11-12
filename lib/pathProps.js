module.exports = (path, router) => {
  const routes = Object.keys(router)
  const split = path.split('/')

  const match = routes.map(route => {
    const routeSplit = route.split('/')
    if (routeSplit.length !== split.length) return false

    return routeSplit.reduce((score, part, i) => {
      if (score) {
        if (part[0] === ':') return { score: score.score + 1, route }
        if (part === split[i]) return { score: score.score + 2, route }
        return false
      }
    }, { score: 0, route })
  }).filter(route => route).sort((a, b) => b.score - a.score)[0]

  if (match) {
    const base = match.route
    const props = base.split('/').reduce((props, part, i) => {
      if (part[0] === ':') props[part.substring(1)] = split[i]
      return props
    }, {})

    return { base, props }
  }
  return { base: 'notFound', props: {} }
}