import AeroTokenIllust from '@/assets/graphics/aero-token-illust.svg'
import BrettTokenIllust from '@/assets/graphics/brett-token-illust.svg'
import DegenTokenIllust from '@/assets/graphics/degen-token-illust.svg'
import { env } from '@/env.mjs'

const rewardToken = env.NEXT_PUBLIC_APP_ID

type EpicConfig = {
  tokenSymbol: string
  tokenDecimals: number
  rewardPool: number
  gradient: string
  EpicTokenIllust: any
}

const epicConfig: Record<string, EpicConfig> = {
  degen: {
    tokenSymbol: 'DEGEN',
    tokenDecimals: 10,
    rewardPool: 1_000_000_000,
    gradient: 'linear-gradient(93deg, #8056E4 30.82%, #5B3EA6 100.41%)',
    EpicTokenIllust: DegenTokenIllust,
  },
  aero: {
    tokenSymbol: 'AERO',
    tokenDecimals: 10,
    rewardPool: 1_000_000_000,
    gradient: 'linear-gradient(91deg, #FF2A1B 30.79%, #FF5145 92.18%)',
    EpicTokenIllust: AeroTokenIllust,
  },
  brett: {
    tokenSymbol: 'BRETT',
    tokenDecimals: 10,
    rewardPool: 1_000_000_000,
    gradient: 'linear-gradient(91deg, #0176F7 30.79%, #0159E5 92.18%)',
    EpicTokenIllust: BrettTokenIllust,
  },
}

export default epicConfig[rewardToken] as EpicConfig
