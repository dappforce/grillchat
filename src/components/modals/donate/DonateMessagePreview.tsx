import LinkText from '@/components/LinkText'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { cx } from '@/utils/class-names'
import BigNumber from 'bignumber.js'
import { HiArrowUpRight } from 'react-icons/hi2'
import CommonChatItem, {
  ExtensionChatItemProps,
} from '../../extensions/CommonChatItem'

type DonatePreviewProps = {
  extensionProps?: any
  isMyMessage: boolean
}

const DonatePreview = ({ extensionProps, isMyMessage }: DonatePreviewProps) => {
  if (!extensionProps) return null

  const { token, amount, txHash } = extensionProps

  const tokenId = coingeckoTokenIds[(token as string).toLowerCase()]

  const { data } = getPriceQuery.useQuery(tokenId)

  const price = data?.current_price

  const amountInDollars =
    price && amount ? new BigNumber(price).multipliedBy(amount).toFixed(4) : '0'

  return (
    <div className={cx('px-5 py-5')}>
      <div className='flex flex-col items-center gap-2 text-white'>
        <div className='flex items-start gap-2'>
          <div className='text-3xl font-bold leading-[26px]'>
            {amount} {token}
          </div>
          <LinkText
            openInNewTab
            href={`https://polygonscan.com/tx/${txHash}`}
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

export type DefaultChatItemProps = ExtensionChatItemProps

export default function DonateMessagePreview({
  message,
  onCheckMarkClick,
  scrollToMessage,
}: DefaultChatItemProps) {
  const { content } = message

  const { extensions, body } = content || {}
  const { properties } = extensions?.[0] || {}

  return (
    <CommonChatItem
      message={message}
      onCheckMarkClick={onCheckMarkClick}
      scrollToMessage={scrollToMessage}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      className={cx(
        'relative flex flex-col overflow-hidden',
        'bg-gradient-to-br from-[#C43333] to-[#F9A11E]',
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
