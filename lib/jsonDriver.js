const fs = require('fs')
const path = require('path')

class jsonDriver {

  constructor() {
    this.baseDir = path.join(__dirname, '/../.data/')
  }

  async init(entities, err) {
    const toSync = entities.map(async entity => {
      const path = `${this.baseDir + entity}`
      if (!await fs.existsSync(path)) return fs.mkdirSync(path)
      return false
    }).filter(entity => entity)
    return Promise.all(toSync)
  }

  async nextId(entity, err) {
    if (!await this.exists(entity, '.counter', err)) {
      await this.create(entity, '.counter', { [entity]: 1 }, err)
      return 1
    }
    const counter = await this.read(entity, '.counter', err)
    const next = counter[entity] + 1
    counter[entity] = next
    await this.replace(entity, '.counter', counter, err)
    return next
  }

  async isUnique(entity, unique, err) {
    if (!await this.exists(entity, '.uniques', err)) {
      await this.create(entity, '.uniques', [unique], err)
      return true
    }
    const uniques = await this.read(entity, '.uniques', err)
    console.log('uniques = ', uniques.indexOf(unique), uniques.indexOf(unique) !== -1)
    if (uniques.indexOf(unique) !== -1) {
      return false
    }
    uniques.push(unique)
    await this.replace(entity, '.uniques', uniques, err)
    return true
  }

  exists(entity, id, err) {
    try {
      return fs.existsSync(`${this.baseDir + entity}/${id}.json`)
    } catch (e) {
      err(e)
    }
  }

  async create(entity, id, payload, err) {
    try {
      const file = await fs.openSync(`${this.baseDir + entity}/${id}.json`, 'wx')
      await fs.writeFileSync(file, JSON.stringify(payload))
      await fs.closeSync(file)
    } catch (e) {
      err(e)
    }
  }

  async read(entity, id, err) {
    try {
      const content = await fs.readFileSync(`${this.baseDir + entity}/${id}.json`, 'utf8')
      return JSON.parse(content)
    } catch (e) {
      err(e)
    }
  }

  async update(entity, id, payload, err) {
    try {
      const content = this.read(entity, id, err)
      const file = await fs.openSync(`${this.baseDir + entity}/${id}.json`, 'r+')
      await fs.ftruncateSync(file)
      await fs.writeFileSync(file, JSON.stringify({ ...content, payload }))
      await fs.closeSync(file)
    } catch (e) {
      err(e)
    }
  }

  async replace(entity, id, payload, err) {
    try {
      const file = await fs.openSync(`${this.baseDir + entity}/${id}.json`, 'r+')
      await fs.ftruncateSync(file)
      await fs.writeFileSync(file, JSON.stringify(payload))
      await fs.closeSync(file)
    } catch (e) {
      err(e)
    }
  }

  delete(entity, id, err) {
    try {
      fs.unlinkSync(`${this.baseDir + entity}/${id}.json`)
    } catch (e) {
      err(e)
    }
  }
}

module.exports = new jsonDriver