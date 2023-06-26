import LinkText from '@/components/LinkText'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { cx } from '@/utils/class-names'
import { getSupportedMarketplaces, nftChains } from './utils'

export type NftSupportedPlatformsModalProps = ModalFunctionalityProps

const upperCasedChains = new Set<(typeof nftChains)[number]>()
upperCasedChains.add('bsc')

export default function NftSupportedPlatformsModal({
  ...props
}: NftSupportedPlatformsModalProps) {
  return (
    <Modal
      {...props}
      title='Supported Platforms'
      onBackClick={() => props.closeModal()}
    >
      <div className='mt-2 grid grid-cols-2'>
        <div className='flex flex-col items-start gap-2'>
          <span className='mb-1 whitespace-nowrap text-xl'>
            🛍️ Marketplaces
          </span>
          {getSupportedMarketplaces().map(({ link, name }) => (
            <LinkText
              key={link}
              href={link}
              openInNewTab
              variant='primary'
              withArrow
              arrowClassName='text-text-muted'
            >
              <span>{name}</span>
            </LinkText>
          ))}
        </div>

        <div className='flex flex-col gap-2'>
          <span className='mb-1 whitespace-nowrap text-xl'>⛓️ Chains</span>
          {nftChains.map((chain) => (
            <span
              key={chain}
              className={cx(
                'capitalize',
                upperCasedChains.has(chain) && 'uppercase'
              )}
            >
              {chain}
            </span>
          ))}
        </div>
      </div>
    </Modal>
  )
}
