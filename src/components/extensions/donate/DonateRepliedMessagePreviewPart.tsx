import { cx, getCommonClassNames } from '@/utils/class-names'
import { formatUnits } from 'ethers'
import { RepliedMessagePreviewPartProps } from '../types'
import { getMessageExtensionProperties } from '../utils'

const DonateRepliedMessagePreviewPart = ({
  extensions,
}: RepliedMessagePreviewPartProps) => {
  const firstExtension = extensions?.[0]
  const properties = getMessageExtensionProperties(
    firstExtension,
    'subsocial-donations'
  )

  const { amount, token, decimals } = properties || {}

  let amountValue = '0'

  try {
    amountValue = amount ? formatUnits(amount, decimals).toString() : '0'
  } catch (e) {
    console.error(e)
  }

  return (
    <span>
      <div
        className={cx(
          getCommonClassNames('donateMessagePreviewBg'),
          'w-max rounded-2xl px-3 py-[0.15rem] text-white'
        )}
      >
        {amountValue} {token}
      </div>
    </span>
  )
}

export default DonateRepliedMessagePreviewPart
