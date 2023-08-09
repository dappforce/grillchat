import LinkText from '@/components/LinkText'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { DonateProperies } from '@subsocial/api/types'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'ethers'
import { HiArrowUpRight } from 'react-icons/hi2'
import CommonChatItem from '../common/CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getMessageExtensionProperties } from '../utils'
import { explorerByChainName } from './api/config'

type DonatePreviewProps = {
  extensionProps?: DonateProperies
  isMyMessage: boolean
  body?: string
  inReplyTo?: string
}

const DonatePreview = ({
  extensionProps,
  body,
  inReplyTo,
}: DonatePreviewProps) => {
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

  const cardMargin = body ? 'mt-1' : 'mt-2'

  return (
    <div
      className={cx(
        'rounded-[4px] px-5 py-5',
        { [cardMargin]: inReplyTo },
        getCommonClassNames('donateMessagePreviewBg')
      )}
    >
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
  chatId,
  hubId,
}: DonateMessagePreviewProps) {
  const { content } = message

  const { extensions, body, inReplyTo } = content || {}
  const properties = getMessageExtensionProperties(
    extensions?.[0],
    'subsocial-donations'
  )

  if (!properties) return null

  return (
    <CommonChatItem
      message={message}
      onCheckMarkClick={onCheckMarkClick}
      scrollToMessage={scrollToMessage}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      className={cx('relative flex flex-col overflow-hidden')}
      chatId={chatId}
      hubId={hubId}
    >
      {({ isMyMessage }) => (
        <div>
          <DonatePreview
            extensionProps={properties}
            isMyMessage={isMyMessage}
            body={body}
            inReplyTo={inReplyTo?.id}
          />
        </div>
      )}
    </CommonChatItem>
  )
}
