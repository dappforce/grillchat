import type { Abi, Address, Narrow } from 'abitype'
import ethAbi from './abi/ethAbi'
import maticAbi from './abi/maticAbi'
import usdcAbi from './abi/usdcAbi'
import usdtAbi from './abi/usdtAbi'

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
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    abi: usdcAbi,
  },
  usdt: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    abi: usdtAbi,
  },
  eth: {
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    abi: ethAbi,
  },
}

export const chainIdByChainName: Record<string, number> = {
  polygon: 137,
  'ethereum-mainnet': 1,
}
