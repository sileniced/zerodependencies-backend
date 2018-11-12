const fs = require('fs')
const path = require('path')

class jsonDriver {

  constructor() {
    this.baseDir = path.join(__dirname, '/../.data/')
  }

  async init(entities, err) {
    for(const entity of entities) {
      const path = `${this.baseDir + entity}`
      if (!await fs.existsSync(path)) await fs.mkdirSync(path)
      if (!await this.exists(entity, '.counter', err)) await this.create(entity, '.counter', { [entity]: 0 }, err)
      if (!await this.exists(entity, '.uniques', err)) await this.create(entity, '.uniques', {}, err)
      if (!await this.exists(entity, '.identifiers', err)) await this.create(entity, '.identifiers', {}, err)
    }
  }

  async getCounter(entity, err) {
    const counter = await this.read(entity, '.counter', err)
    counter[entity]++
    return counter
  }

  async setCounter(entity, counter, err) {
    await this.replace(entity, '.counter', counter, err)
  }

  async getUniques(entity, column, err) {
    const uniques = await this.read(entity, '.uniques', err)
    if (!uniques[column]) uniques[column] = []
    return uniques
  }

  async isUnique(entity, column, unique, err) {
    try {
      const uniques = this.getUniques(entity, column, err)
      return uniques[column].indexOf(unique) <= -1
    } catch (e) {
      err(e)
    }
  }

  async addToUniques(entity, column, unique, err) {
    try {
      const uniques = this.getUniques(entity, column, err)
      uniques[column].push(unique)
      await this.replace(entity, '.uniques', uniques, err)
    } catch (e) {
      err(e)
    }
  }

  getIdentifiers(entity, err) {
    return this.read(entity, '.identifiers', err)
  }

  async getIdFromIdentifier(entity, identifier, err) {
    const identifiers = await this.getIdentifiers(entity, err)
    return identifiers[identifier]
  }

  async addToIdentifiers(entity, identifier, err) {
    const identifiers = await this.getIdentifiers(entity, err)
    console.log({ ...identifiers, ...identifier })
    await this.replace(entity, '.identifiers', { ...identifiers, ...identifier }, err)
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
      if (!await this.exists(entity, id, err)) throw `${entity} id does not exist`
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