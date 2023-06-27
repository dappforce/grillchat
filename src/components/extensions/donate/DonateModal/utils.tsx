import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Polygon from '@/assets/graphics/chains/polygon.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'
import { StaticImageData } from 'next/image'

export const chainItems = [
  {
    id: 'polygon',
    icon: Polygon,
    label: 'Polygon',
  },
  {
    id: 'moonbeam',
    icon: Moonbeam,
    label: 'Moonbeam',
  },
  {
    id: 'astar',
    icon: Astar,
    label: 'Astar',
    disabledItem: true,
  },
]

type TokenItem = {
  id: string
  icon: StaticImageData
  label: string
  isNativeToken?: boolean
}

type TokenItemsByChainName = Record<string, TokenItem[]>

export const tokensItems: TokenItemsByChainName = {
  polygon: [
    {
      id: 'usdt',
      icon: USDT,
      label: 'USDT',
    },
    {
      id: 'usdc',
      icon: USDC,
      label: 'USDC',
    },
    {
      id: 'matic',
      icon: Polygon,
      label: 'MATIC',
      isNativeToken: true,
    },
    {
      id: 'eth',
      icon: ETH,
      label: 'ETH',
    },
  ],
  moonbeam: [
    {
      id: 'glmr',
      icon: Polygon,
      label: 'GLMR',
      isNativeToken: true,
    },
    {
      id: 'dot',
      icon: Polygon,
      label: 'DOT',
    },
    {
      id: 'usdt',
      icon: USDT,
      label: 'USDT',
    },
    {
      id: 'usdc',
      icon: USDC,
      label: 'USDC',
    },
    {
      id: 'astr',
      icon: ETH,
      label: 'ASTR',
    },
  ],
}
