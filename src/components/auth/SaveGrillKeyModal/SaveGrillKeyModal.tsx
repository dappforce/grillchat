import Button from '@/components/Button'
import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import InfoPanel from '@/components/InfoPanel'
import PopOver from '@/components/floating/PopOver'
import TextArea from '@/components/inputs/TextArea'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { spaceMono } from '@/fonts'
import { SupportedExternalProvider } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { decodeSecretKey } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { estimatedWaitTime } from '@/utils/network'
import { copyToClipboard } from '@/utils/strings'
import { useEffect, useState } from 'react'
import { MdOutlineContentCopy } from 'react-icons/md'
import useOauthLogin from './useOauthLogin'

export type SaveGrillKeyModalProps = ModalFunctionalityProps

type Steps = 'save' | 'enter' | 'loading'
const providerMapper: Record<SupportedExternalProvider, string> = {
  evm: 'EVM',
  google: 'Google',
  x: 'X',
}
export default function SaveGrillKeyModal({
  provider,
  ...props
}: SaveGrillKeyModalProps & { provider?: 'x' | 'google' | 'evm' }) {
  const [step, setStep] = useState<'save' | 'enter' | 'loading'>('save')
  const [isDoneLoading, setIsDoneLoading] = useState(false)

  useEffect(() => {
    if (step === 'loading' && isDoneLoading) props.closeModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDoneLoading, step])

  const modalInfo: Record<
    Steps,
    { title: string; desc: string; backTo?: Steps }
  > = {
    save: {
      title: '🔑 Save your Grill key',
      desc: 'Your Grill key is like a long password. Save it in a safe place, so you can recover your account later.',
    },
    enter: {
      title: '🔑 Enter your Grill key',
      desc: "Enter the Grill key you received in the previous step. This way, we'll make sure you saved it.",
      backTo: 'save',
    },
    loading: {
      title: `🕔 Connecting to ${providerMapper[provider ?? 'google']}`,
      desc: `We are connecting your ${
        providerMapper[provider ?? 'google']
      } account to Grill.chat. Please wait for a few seconds.`,
    },
  }
  const currentInfo = modalInfo[step]

  const contentProps: ContentProps = {
    closeModal: props.closeModal,
    setCurrentState: setStep,
  }

  return (
    <Modal
      {...props}
      title={currentInfo.title}
      description={currentInfo.desc}
      onBackClick={
        currentInfo.backTo ? () => setStep(currentInfo.backTo!) : undefined
      }
    >
      {provider !== 'evm' && (
        <DoOauthLogin onSuccess={() => setIsDoneLoading(true)} />
      )}
      {step === 'save' && <SaveGrillKeyModalSaveStep {...contentProps} />}
      {step === 'enter' && <SaveGrillKeyModalEnterStep {...contentProps} />}
      {step === 'loading' && <SaveGrillKeyModalLoadingStep {...contentProps} />}
    </Modal>
  )
}

function DoOauthLogin({ onSuccess }: { onSuccess: () => void }) {
  useOauthLogin({ onSuccess })
  return null
}

type ContentProps = {
  closeModal: () => void
  setCurrentState: (state: Steps) => void
}
function SaveGrillKeyModalSaveStep({ setCurrentState }: ContentProps) {
  const [openCopiedTooltip, setOpenCopiedTooltip] = useState(false)
  const encodedSecretKey = useMyAccount.use.encodedSecretKey()

  useEffect(() => {
    if (!openCopiedTooltip) return
    setTimeout(() => {
      setOpenCopiedTooltip(false)
    }, 2000)
  }, [openCopiedTooltip])

  return (
    <div className='flex flex-col gap-4'>
      <div
        className={cx(
          'flex min-h-16 items-stretch justify-between rounded-2xl border border-border-gray',
          spaceMono.className
        )}
      >
        <div className={cx('cursor-pointer select-all break-words px-4 py-2')}>
          {decodeSecretKey(encodedSecretKey ?? '')}
        </div>
        <PopOver
          panelSize='sm'
          placement='top'
          triggerClassName='flex-shrink-0'
          yOffset={-4}
          manualTrigger={{
            isOpen: openCopiedTooltip,
            setIsOpen: setOpenCopiedTooltip,
          }}
          trigger={
            <div className='px-3'>
              <Button
                variant='transparent'
                className='p-1 text-text-primary'
                onClick={() =>
                  copyToClipboard(decodeSecretKey(encodedSecretKey ?? ''))
                }
              >
                <MdOutlineContentCopy />
              </Button>
            </div>
          }
        >
          <span>Copied!</span>
        </PopOver>
      </div>
      <Button size='lg' onClick={() => setCurrentState('enter')}>
        I saved my key in a safe place
      </Button>
    </div>
  )
}

function SaveGrillKeyModalEnterStep({ setCurrentState }: ContentProps) {
  const encodedSecretKey = useMyAccount.use.encodedSecretKey()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const isFinished = value.split(/[a-z]\s[a-z]/g).length === 12

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (value.trim() !== decodeSecretKey(encodedSecretKey ?? '')) {
          setError('The Grill key you entered is incorrect. Please try again.')
          return
        }
        setCurrentState('loading')
      }}
      className='flex flex-col gap-4'
    >
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Enter your Grill key'
        rows={3}
        size='sm'
      />
      {error && <InfoPanel variant='error'>{error}</InfoPanel>}
      <Button size='lg' disabled={!isFinished} type='submit'>
        Finish
      </Button>
    </form>
  )
}

function SaveGrillKeyModalLoadingStep({}: ContentProps) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <DynamicLoadedHamsterLoading />
      <span className='text-sm text-text-muted'>
        It may take up to {estimatedWaitTime} seconds
      </span>
    </div>
  )
}
