module.exports = (path, routes) => {
  const split = path.split('/')

  const match = routes.map(base => {
    const routeSplit = base.split('/')
    if (routeSplit.length !== split.length) return false

    return routeSplit.reduce((score, part, i) => {
      if (score) {
        if (part[0] === ':') {
          score.score = score.score + 1
          score.props[part.substring(1)] = split[i]
          return score
        }
        if (part === split[i]) {
          score.score = score.score + 2
          return score
        }
        return false
      }
    }, { score: 0, base, props: {} })
  }).filter(route => route).sort((a, b) => b.score - a.score)[0]

  return match ||{ base: 'notFound', props: {} }
}