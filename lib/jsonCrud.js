const fs = require('fs')
const path = require('path')

class jsonCrud {

  constructor() {
    this.baseDir = path.join(__dirname, '/../.data/')
  }

  async create(base, name, payload, err) {
    try {
      const file = await fs.openSync(`${this.baseDir + base}/${name}.json`, 'wx')
      await fs.writeFileSync(file, JSON.stringify(payload))
      await fs.closeSync(file)
    } catch(e) {
      err(e)
    }
  }

  read(base, name, err) {
    try {
      return fs.readFileSync(`${this.baseDir + base}/${name}.json`, 'utf8')
    } catch (e) {
      err(e)
    }

  }

  async update(base, name, payload, err) {
    try {
      const file = await fs.openSync(`${this.baseDir + base}/${name}.json`, 'r+')
      await fs.ftruncateSync(file)
      await fs.writeFileSync(file, JSON.stringify(payload))
      await fs.closeSync(file)
    } catch(e) {
      err(e)
    }
  }

  delete(base, name, err) {
    try{
      fs.unlinkSync(`${this.baseDir + base}/${name}.json`)
    } catch (e) {
      err(e)
    }
  }
}

module.exports = new jsonCrud