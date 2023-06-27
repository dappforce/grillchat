import LinkText from '@/components/LinkText'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { DonateExtension, DonateProperies } from '@subsocial/api/types'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { HiArrowUpRight } from 'react-icons/hi2'
import CommonChatItem from '../CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { explorerByChainName } from './api/config'

type DonatePreviewProps = {
  extensionProps?: DonateProperies
  isMyMessage: boolean
}

const DonatePreview = ({ extensionProps }: DonatePreviewProps) => {
  if (!extensionProps) return null

  const { token, amount, txHash, decimals, chain } = extensionProps

  const tokenId = coingeckoTokenIds[(token as string).toLowerCase()]

  const { data } = getPriceQuery.useQuery(tokenId)

  let amountValue = '0'
  try {
    amountValue = formatUnits(amount, decimals).toString()
  } catch (e) {
    console.error(e)
  }

  const price = data?.current_price

  const amountInDollars =
    price && amount
      ? new BigNumber(price).multipliedBy(amountValue).toFixed(4)
      : '0'

  return (
    <div className={cx('px-5 py-5')}>
      <div className='flex flex-col items-center gap-2 text-white'>
        <div className='flex items-start gap-2'>
          <div className='text-3xl font-bold leading-[26px]'>
            {amountValue} {token}
          </div>
          <LinkText
            openInNewTab
            href={`${explorerByChainName[chain]}${txHash}`}
            variant='primary'
            className='text-white'
          >
            <HiArrowUpRight />
          </LinkText>
        </div>
        <div className='text-sm'>≈ ${amountInDollars}</div>
      </div>
    </div>
  )
}

type DonateMessagePreviewProps = ExtensionChatItemProps

export default function DonateMessagePreview({
  message,
  onCheckMarkClick,
  scrollToMessage,
}: DonateMessagePreviewProps) {
  const { content } = message

  const { extensions, body } = content || {}
  const { properties } = (extensions?.[0] as DonateExtension) || {}

  return (
    <CommonChatItem
      message={message}
      onCheckMarkClick={onCheckMarkClick}
      scrollToMessage={scrollToMessage}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      textColor='#FCEEE2'
      className={cx(
        'relative flex flex-col overflow-hidden',
        getCommonClassNames('donateMessagePreviewBg'),
        'text-white'
      )}
    >
      {({ isMyMessage }) => (
        <div>
          {body && (
            <div className='px-[10px]'>
              <div className='mt-[5px] w-full ring-[0.4px] ring-[#f39424]'></div>
            </div>
          )}
          <DonatePreview
            extensionProps={properties}
            isMyMessage={isMyMessage}
          />
        </div>
      )}
    </CommonChatItem>
  )
}
