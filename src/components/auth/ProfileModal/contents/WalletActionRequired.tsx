import ProcessingHumster from '@/assets/graphics/processing-humster.png'
import Image from 'next/image'
import { ProfileModalContentProps } from '../types'

export const WalletActionRequiredBody = () => (
  <div className='flex w-full flex-col items-center gap-4'>
    <Image
      className='w-64 max-w-xs rounded-full'
      priority
      src={ProcessingHumster}
      alt=''
    />
  </div>
)

const ActionRequierdContent = (_props: ProfileModalContentProps) => (
  <WalletActionRequiredBody />
)

export default ActionRequierdContent
