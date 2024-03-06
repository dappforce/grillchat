import BN from 'bignumber.js'

const getAmountRange = (amount?: string) => {
  if (!amount || amount === '0') return '0'

  const amountBN = new BN(amount)

  if (amountBN.isZero()) {
    return '0'
  } else if (amountBN.lte(2000)) {
    return 'up to 2000'
  } else if (amountBN.lte(10000)) {
    return 'up to 10000'
  } else if (amountBN.lte(50000)) {
    return 'up to 50000'
  } else if (amountBN.lte(100000)) {
    return 'up to 100000'
  } else if (amountBN.lte(500000)) {
    return 'up to 500000'
  } else if (amountBN.lte(1000000)) {
    return 'up to 1000000'
  } else {
    return 'more than 1000000'
  }
}

export default getAmountRange
