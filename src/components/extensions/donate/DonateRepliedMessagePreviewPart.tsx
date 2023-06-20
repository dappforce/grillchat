import { cx } from '@/utils/class-names'
import { DonateExtension } from '@subsocial/api/types'
import { formatUnits } from 'ethers'
import { RepliedMessagePreviewPartProps } from '../RepliedMessagePreviewParts'

const DonateRepliedMessagePreviewPart = ({
  extensions,
}: RepliedMessagePreviewPartProps) => {
  const firstExtension = extensions?.[0] as DonateExtension

  const { id, properties } = firstExtension || {}

  const { amount, token, decimals } = properties || {}

  const amountValue = amount ? formatUnits(amount, decimals).toString() : '0'

  return (
    <span>
      {id === 'subsocial-donations' ? (
        <div
          className={cx(
            'mt-1 bg-gradient-to-br from-[#C43333] to-[#F9A11E]',
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
