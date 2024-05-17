import Button from '@/components/Button'
import { useSendEvent } from '@/stores/analytics'
import { AiOutlineScan } from 'react-icons/ai'
import { LoginModalContentProps, LoginModalStep } from './LoginModalContent'

export let prevScanQrStep: LoginModalStep | null = null

export default function ScanQRButton({
  setCurrentState,
  currentStep,
}: LoginModalContentProps) {
  const sendEvent = useSendEvent()
  return (
    <Button
      variant='transparent'
      size='noPadding'
      onClick={() => {
        setCurrentState('scan-qr')
        prevScanQrStep = currentStep
        sendEvent('login_scan_qr_clicked', { eventSource: currentStep })
      }}
      interactive='none'
      className='absolute right-5 top-[1.625rem] flex items-center gap-2 text-text-primary outline-none md:right-6 md:top-7'
    >
      <AiOutlineScan className='text-2xl md:text-xl' />
      <span className='hidden md:block'> Login with QR</span>
    </Button>
  )
}
