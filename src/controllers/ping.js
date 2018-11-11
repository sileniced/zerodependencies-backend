class ping {

  GET(data, callback) {
    callback({ 'I\'m': 'alive' })
  }

}

module.exports = new ping