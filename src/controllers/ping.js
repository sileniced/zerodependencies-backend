class ping {

  GET() {
    return async (data, callback) => {
      callback({ 'I\'m': 'alive' })
    }
  }

}

module.exports = new ping