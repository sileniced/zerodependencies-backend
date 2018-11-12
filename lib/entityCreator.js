const crud = require('./jsonDriver')

module.exports.create = async (entity, data, err) => {
  const id = await crud.nextId(entity, err)
  return {
    id,
    ...data,
  }
}