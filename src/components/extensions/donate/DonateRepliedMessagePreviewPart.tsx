import { cx, getCommonClassNames } from '@/utils/class-names'
import { DonateExtension } from '@subsocial/api/types'
import { formatUnits } from 'ethers'
import { RepliedMessagePreviewPartProps } from '../types'

const DonateRepliedMessagePreviewPart = ({
  extensions,
}: RepliedMessagePreviewPartProps) => {
  const firstExtension = extensions?.[0] as DonateExtension

  const { id, properties } = firstExtension || {}

  const { amount, token, decimals } = properties || {}

  let amountValue = '0'

  try {
    amountValue = amount ? formatUnits(amount, decimals).toString() : '0'
  } catch (e) {
    console.error(e)
  }

  return (
    <span>
      {id === 'subsocial-donations' ? (
        <div
          className={cx(
            getCommonClassNames('donateMessagePreviewBg'),
            'rounded-2xl px-3 py-[0.15rem] text-white'
          )}
        >
          {amountValue} {token}
        </div>
      ) : null}
    </span>
  )
}

export default DonateRepliedMessagePreviewPart
