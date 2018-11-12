const crud = require('./jsonDriver')
const validator = require('./validator')
const { hash } = require('./passwordHasher')

class EntityManager {

  sansTags(columns) {
    return columns.map(column => {
      if (column.password) return column.password
      if (column.unique) return column.unique
      if (column.identifier) return column.identifier
      return column
    })
  }

  async create(entity, columns, data, err) {
    const counter = await crud.getCounter(entity, false, err)
    const valid = validator(this.sansTags(columns), data, err)

    for (const column of columns) {
      if (column.password) valid[column.password] = hash(valid[column.password], err)
      if (column.unique && !await crud.isUnique(entity, column.unique, valid[column.unique], err)) err('not unique')
      if (column.identifier && await crud.getIdFromIdentifier(entity, valid[column.identifier], err)) err('identifier not unique')
    }

    return {
      id: counter[entity],
      ...valid,
    }
  }

  async commit(entity, columns, valid, err) {
    await crud.setCounter(entity, { [entity]: valid.id }, err)

    for (const column of columns) {
      if (column.unique) await crud.addToUniques(entity, column.unique, valid[column.unique], err)
      if (column.identifier) await crud.addToIdentifiers(entity, { [valid[column.identifier]]: valid.id }, err)
    }

    await crud.create('users', valid.id, valid, err)
  }

}

module.exports = new EntityManager