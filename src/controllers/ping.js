class ping {

  GET() {
    return async (data, err) => ({ status: 200, payload: { ping: { 'I\'m': 'alive' } } })
  }

  PROPS(props) {
    return async (data, err) => ({ status: 200, payload: { props } })
  }
}


module.exports = new ping