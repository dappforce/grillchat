import Astar from '@/assets/graphics/chains/astar.png'
import Moonbeam from '@/assets/graphics/chains/moonbeam.png'
import Poligon from '@/assets/graphics/chains/polygon.png'
import ETH from '@/assets/graphics/tokens/eth.png'
import USDC from '@/assets/graphics/tokens/usdc.png'
import USDT from '@/assets/graphics/tokens/usdt.png'

export const chainItems = [
  {
    id: 'polygon',
    icon: Poligon,
    label: 'Polygon',
  },
  {
    id: 'astar',
    icon: Astar,
    label: 'Astar',
    disabledItem: true,
  },
  {
    id: 'moonbeam',
    icon: Moonbeam,
    label: 'Moonbeam',
    disabledItem: true,
  },
]

export const tokensItems = [
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
    icon: Poligon,
    label: 'MATIC',
    isNativeToken: true,
  },
  {
    id: 'eth',
    icon: ETH,
    label: 'ETH',
  },
]
