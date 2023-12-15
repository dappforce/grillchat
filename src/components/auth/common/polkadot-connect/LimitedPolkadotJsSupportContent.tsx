import SadHamster from '@/assets/graphics/sad-hamster.png'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import Image from 'next/image'

export default function LimitedPolkadotJsSupportContent() {
  return (
    <div className='flex flex-col items-center gap-6'>
      <Image src={SadHamster} className='w-64' alt='' />
      <Button
        size='lg'
        className='w-full'
        href={getCurrentUrlWithoutQuery()}
        target='_blank'
      >
        Go to Grill.chat site
      </Button>
    </div>
  )
}

export function LimitedPolkadotJsSupportExplanation({
  goToWalletSelection,
}: {
  goToWalletSelection: () => void
}) {
  return (
    <span>
      To keep using Polkadot.js, please switch to the website version of{' '}
      <LinkText
        variant='primary'
        href={getCurrentUrlWithoutQuery()}
        openInNewTab
      >
        Grill.chat
      </LinkText>
      . To use this embedded version, please use{' '}
      <LinkText variant='primary' onClick={goToWalletSelection}>
        another wallet
      </LinkText>
      .
    </span>
  )
}
