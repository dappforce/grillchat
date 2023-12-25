import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import Image from 'next/image'
import { isValidElement } from 'react'
import { useGetBalance } from '../../api/hooks'
import { TokenListItem } from '../types'

type TokenItemPreviewProps = {
  item: TokenListItem
  chainName: string
  open: boolean
}

const TokenItemPreview = ({ item, chainName, open }: TokenItemPreviewProps) => {
  const { balance, decimals } = useGetBalance(item.id, chainName, open)

  const tokenId = coingeckoTokenIds[(item.id as string).toLowerCase()]

  const { data } = getPriceQuery.useQuery(tokenId)

  const price = data?.current_price

  const balanceValue =
    decimals && balance ? formatUnits(balance, decimals) : '0'

  const amountInDollars =
    price && balance
      ? new BigNumber(price).multipliedBy(balanceValue).toFixed(4)
      : '0'

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-3'>
        {item.icon &&
          (isValidElement(item.icon) ? (
            item.icon
          ) : (
            <Image
              src={item.icon as string}
              className={cx('w-[38px] rounded-full')}
              alt=''
              role='presentation'
            />
          ))}
        <span
          className={cx('mr-3 block truncate text-base', {
            ['text-gray-500']: item.disabledItem,
          })}
        >
          {item.label}
        </span>
      </div>
      <div className='flex flex-col text-right'>
        <span className='font-bold'>{balanceValue.slice(0, 6)}</span>
        <span className='text-text-muted'>${amountInDollars}</span>
      </div>
    </div>
  )
}

export default TokenItemPreview
