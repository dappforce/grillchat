import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import {
  coingeckoTokenIds,
  getPriceQuery,
} from '@/services/subsocial/prices/query'
import { getBalancesQuery } from '@/services/substrateBalances/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { getBalanceInDollars } from '@/utils/balance'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { DonateProperies } from '@subsocial/api/types'
import { formatUnits } from 'ethers'
import { HiArrowUpRight } from 'react-icons/hi2'
import CommonChatItem from '../common/CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getPostExtensionProperties } from '../utils'
import { getExplorerByChainName } from './api/config'

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
  const { openModal } = useProfileModal()
  const myAddress = useMyMainAddress()
  const { refetch } = getBalancesQuery.useQuery(
    { address: myAddress ?? '', chainName: 'subsocial' },
    { enabled: false }
  )

  if (!extensionProps) return null

  const { token, amount, txHash, decimals, chain, to } = extensionProps
  const isMyAddress = myAddress === to

  const tokenId = coingeckoTokenIds[(token as string).toLowerCase()]

  const { data } = getPriceQuery.useQuery(tokenId)

  let amountValue = '0'
  try {
    amountValue = formatUnits(amount, decimals).toString()
  } catch (e) {
    console.error(e)
  }

  const price = data?.current_price

  const amountInDollars = getBalanceInDollars(amountValue, price)

  return (
    <div
      className={cx(
        'rounded-[4px] px-5 py-5',
        { 'mt-1': body || inReplyTo },
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
            href={getExplorerByChainName(txHash, chain)}
            variant='primary'
            className='text-white'
          >
            <HiArrowUpRight />
          </LinkText>
        </div>
        <div className='text-sm'>≈ ${amountInDollars}</div>
        {isMyAddress && (
          <Button
            variant='whiteOutline'
            size='sm'
            className='bg-white text-[#DA612B] hover:bg-transparent hover:text-white focus-visible:bg-transparent focus-visible:text-white'
            onClick={() => {
              refetch()
              openModal({ defaultOpenState: 'withdraw-tokens' })
            }}
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  )
}

type DonateMessagePreviewProps = ExtensionChatItemProps

export default function DonateMessagePreview({
  message,
  scrollToMessage,
  chatId,
  hubId,
}: DonateMessagePreviewProps) {
  const { content } = message

  const { extensions, body, inReplyTo } = content || {}
  const properties = getPostExtensionProperties(
    extensions?.[0],
    'subsocial-donations'
  )

  if (!properties) return null

  return (
    <CommonChatItem
      message={message}
      scrollToMessage={scrollToMessage}
      myMessageConfig={{ children: 'bottom', checkMark: 'adaptive-inside' }}
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
