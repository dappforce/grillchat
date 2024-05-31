const myAddressIndex = 1001

export const getTmpData = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const myAddress = '0x3C66e2cE7B0d28415A0Ad1A0C4837E03ca407071'

    return {
      reward: '100',
      rank: i + 1,
      address:
        i === myAddressIndex
          ? myAddress
          : '0x271930190814fb893C3DfC73A52e9Cf21a608DAF',
    }
  })
}
