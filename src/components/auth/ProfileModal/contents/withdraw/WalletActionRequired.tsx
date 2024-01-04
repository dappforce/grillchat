import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Image from 'next/image'
import { ProfileModalContentProps } from '../../types'

const WalletActionRequired = (_props: ProfileModalContentProps) => (
  <div className='flex w-full flex-col items-center gap-4'>
    <Image
      className='w-64 max-w-xs rounded-full'
      priority
      src={ProcessingHumster}
      alt=''
    />
  </div>
)

export default WalletActionRequired
