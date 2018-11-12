class ping {

  GET() {
    return async (data, err) => ({ status: 200, payload: { ping: { 'I\'m': 'alive' } } })
  }
}


module.exports = new ping