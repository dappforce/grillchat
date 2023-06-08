import type { Abi, Address, Narrow } from 'abitype'
import ethAbi from './abi/eth'
import maticAbi from './abi/maticAbi'
import usdcAbi from './abi/usdcAbi'

type ContractConfig = {
  address: Address
  abi: Narrow<Abi>
}

type ContractConfigByToken = Record<string, ContractConfig>

export const polygonContractsByToken: ContractConfigByToken = {
  matic: {
    address: '0x0000000000000000000000000000000000001010',
    abi: maticAbi,
  },
  usdc: {
    address: '0xDD9185DB084f5C4fFf3b4f70E7bA62123b812226',
    abi: usdcAbi,
  },
  eth: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    abi: ethAbi,
  },
}
