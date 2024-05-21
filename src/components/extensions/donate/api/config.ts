import type { Abi, Address, Narrow } from 'abitype'
import ethAbi from './abi/polygon/ethAbi'
import usdcAbi from './abi/polygon/usdcAbi'
import usdtAbi from './abi/polygon/usdtAbi'

import degenAbi from './abi/base/degenAbi'
import astrAbi from './abi/moonbeam/astrAbi'
import dotAbi from './abi/moonbeam/dotAbi'
import subAbi from './abi/moonbeam/subAbi'
import moonbeamUsdcAbi from './abi/moonbeam/usdcAbi'
import moonbeamUsdtAbi from './abi/moonbeam/usdtAbi'

type ContractConfig = {
  address: Address
  abi: Narrow<Abi>
}

type ContractConfigByToken = Record<string, Record<string, ContractConfig>>

export const contractsByChainName: ContractConfigByToken = {
  base: {
    degen: {
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      abi: degenAbi,
    },
  },
  polygon: {
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
  },
  moonbeam: {
    dot: {
      address: '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080',
      abi: dotAbi,
    },
    usdt: {
      address: '0xFFFFFFfFea09FB06d082fd1275CD48b191cbCD1d',
      abi: moonbeamUsdtAbi,
    },
    usdc: {
      address: '0xffFfFffeFd9d0bf45a2947A519a741c4b9E99EB6',
      abi: moonbeamUsdcAbi,
    },
    astr: {
      address: '0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf',
      abi: astrAbi,
    },
    sub: {
      address: '0xffffffff43b4560bc0c451a3386e082bff50ac90',
      abi: subAbi,
    },
  },
}

export const chainIdByChainName: Record<string, number> = {
  polygon: 137,
  moonbeam: 1284,
  'ethereum-mainnet': 1,
  base: 8453,
}

export const getExplorerByChainName = (hash: string, chainName: string) => {
  const exlorerLinkByChainName: Record<string, string> = {
    polygon: `https://polygonscan.com/tx/${hash}`,
    moonbeam: `https://moonscan.io/tx/${hash}`,
    subsocial: `https://calamar.app/search?query=${hash}&network=subsocial`,
    base: `https://basescan.org/tx/${hash}`,
  }

  return exlorerLinkByChainName[chainName]
}
