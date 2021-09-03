
const sellerIdToMarketId = (sellerId) => {
  const orderSplit = sellerId.split('-')
  if (orderSplit.length === 3) {
    return sellerId.substr(sellerId.search('-') + 1)
  }
  return sellerId
}

const sellerIdToLowerCase = (sellerId) => {
  const orderSplit = sellerId.split('-')
  if (orderSplit.length === 3) {
    return `${orderSplit[0]}-${orderSplit[1].toLowerCase()}-${orderSplit[2]}`
  }
  return sellerId.toLowerCase()
}

const formatName = (name) => {
  const container = name.split(' ')
  let first_name = ''
  let last_name = ''

  switch (container.length) {
    case 2:
      first_name = container[0]
      last_name = container[1]
      return { first_name, last_name }
    case 3:
      first_name = name.split(' ').slice(0, -2).join(' ')
      last_name = name.split(' ').slice(-2).join(' ')
      return { first_name, last_name }
    case 4:
      first_name = name.split(' ').slice(0, -2).join(' ')
      last_name = name.split(' ').slice(-2).join(' ')
      return { first_name, last_name }
  }
}

const dateSapNumberToString = (dateNumber) => `${`${dateNumber}`.substring(0, 4)}-${`${dateNumber}`.substring(4, 6)}-${`${dateNumber}`.substring(6, 8)}`

const dateTimeSapNumberToString = (dateNumber, timeNumber) => `${`${dateNumber}`.substring(0, 4)}-${`${dateNumber}`.substring(4, 6)}-${`${dateNumber}`.substring(6, 8)} ${`${timeNumber}`.substring(0, 2)}:${`${timeNumber}`.substring(2, 4)}:${`${timeNumber}`.substring(4, 6)}`

module.exports = { sellerIdToMarketId, sellerIdToLowerCase, dateSapNumberToString, dateTimeSapNumberToString, formatName }
