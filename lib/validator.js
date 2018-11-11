const string = string => typeof(string) === 'string' && string.trim().length > 0 ? string.trim() : false
const number = number => typeof(Number(number)) === 'number' && number
const boolean = boolean => typeof(boolean) === 'boolean' && { boolean }

module.exports = (columns, data, err) => {

  const array = columns.map(column => {
    if (column.number) return number(data[column.number])
    if (column.boolean) return boolean(data[column.boolean])
    return string(data[column])
  })

  return columns.reduce((acc, column, i) => {
    if (column.number) {
      if (!array[i]) err(column.number)
      acc[column.number] = array[i]
    }

    if (column.boolean) {
      if (!array[i]) err(column.boolean)
      acc[column.boolean] = array[i].boolean
    }

    if (column.string) {
      if (!array[i]) err(column.string)
      acc[column.string] = array[i]
    }

    if (typeof(column) === 'string') {
      if (!array[i]) err(column)
      acc[column] = array[i]
    }
    return acc
  }, {})
}
