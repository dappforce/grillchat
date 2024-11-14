import Button from '@/components/Button'
import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import InfoPanel from '@/components/InfoPanel'
import ProfilePreview from '@/components/ProfilePreview'
import PopOver from '@/components/floating/PopOver'
import TextArea from '@/components/inputs/TextArea'
import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import { spaceMono } from '@/fonts'
import { useSendEvent } from '@/stores/analytics'
import { SupportedExternalProvider, useLoginModal } from '@/stores/login-modal'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { decodeSecretKey } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { estimatedWaitTime } from '@/utils/network'
import { copyToClipboard } from '@/utils/strings'
import { useEffect, useState } from 'react'
import { MdOutlineContentCopy } from 'react-icons/md'
import { finishLogin } from '../utils'
import useOauthLogin from './useOauthLogin'

export type SaveGrillKeyModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'withoutOverlay' | 'withoutShadow'>

type Steps = 'save' | 'enter' | 'loading' | 'account-created'
const providerMapper: Record<SupportedExternalProvider, string> = {
  evm: 'EVM',
  google: 'Google',
  x: 'X',
  polkadot: 'Polkadot',
  solana: 'Solana',
}
export default function SaveGrillKeyModal({
  provider,
  ...props
}: SaveGrillKeyModalProps & { provider?: SupportedExternalProvider }) {
  const [step, setStep] = useState<Steps>('save')
  const [isDoneLoading, setIsDoneLoading] = useState(false)
  const sendEvent = useSendEvent()

  useEffect(() => {
    if (props.isOpen) {
      setStep('save')
      setIsDoneLoading(false)
    }
  }, [props.isOpen])
  useEffect(() => {
    if (step === 'loading' && isDoneLoading) setStep('account-created')
  }, [isDoneLoading, step])

  const modalInfo: Record<
    Steps,
    {
      title: string
      desc: string
      backTo?: Steps
      component: (props: ContentProps) => JSX.Element
    }
  > = {
    save: {
      title: '🔑 Save your Grill key',
      desc: 'Your Grill key is like a long password. Save it in a safe place, so you can recover your account later.',
      component: SaveStep,
    },
    enter: {
      title: '🔑 Enter your Grill key',
      desc: "Enter the Grill key you received in the previous step. This way, we'll make sure you saved it.",
      backTo: 'save',
      component: EnterKeyStep,
    },
    loading: {
      title: `🕔 Connecting to ${providerMapper[provider ?? 'google']}`,
      desc: `We are connecting your ${
        providerMapper[provider ?? 'google']
      } account to Grill. Please wait for a few seconds.`,
      component: LoadingStep,
    },
    'account-created': {
      title: '🎉 Account created',
      desc: 'We have created an account linked to your X for you. You can now use Grill!',
      component: AccountCreatedStep,
    },
  }
  const currentInfo = modalInfo[step]
  const Component = currentInfo.component

  const contentProps: ContentProps = {
    closeModal: props.closeModal,
    setCurrentState: setStep,
    provider: provider ?? 'google',
  }

  const closeModal = () => {
    if (step === 'account-created') finishLogin(props.closeModal)
  }

  return (
    <Modal
      {...props}
      closeModal={closeModal}
      title={currentInfo.title}
      description={currentInfo.desc}
      withCloseButton={step === 'account-created'}
      onBackClick={
        currentInfo.backTo
          ? () => {
              if (step === 'enter') sendEvent('login_mnemonic_back_clicked')
              setStep(currentInfo.backTo!)
            }
          : undefined
      }
    >
      {props.isOpen && provider !== 'evm' && provider !== 'polkadot' && (
        <DoOauthLogin onSuccess={() => setIsDoneLoading(true)} />
      )}
      <Component {...contentProps} />
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
  provider: SupportedExternalProvider
}
function SaveStep({ setCurrentState }: ContentProps) {
  const [openCopiedTooltip, setOpenCopiedTooltip] = useState(false)
  const encodedSecretKey = useMyAccount.use.encodedSecretKey()
  const sendEvent = useSendEvent()

  useEffect(() => {
    sendEvent('login_mnemonic_opened')
  }, [sendEvent])

  return (
    <div className='flex flex-col gap-4'>
      <div
        className={cx(
          'flex min-h-16 items-stretch justify-between rounded-2xl border border-border-gray',
          spaceMono.className
        )}
      >
        <div
          className={cx('cursor-pointer select-all break-words px-4 py-2')}
          onCopy={() => sendEvent('login_mnemonic_copied')}
        >
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
                onClick={() => {
                  copyToClipboard(decodeSecretKey(encodedSecretKey ?? ''))
                  sendEvent('login_mnemonic_copy_clicked')
                }}
              >
                <MdOutlineContentCopy />
              </Button>
            </div>
          }
        >
          <span>Copied!</span>
        </PopOver>
      </div>
      <Button
        size='lg'
        onClick={() => {
          setCurrentState('enter')
          sendEvent('login_mnemonic_confirmed')
        }}
      >
        I saved my key in a safe place
      </Button>
    </div>
  )
}

function EnterKeyStep({ setCurrentState, provider, closeModal }: ContentProps) {
  const encodedSecretKey = useMyAccount.use.encodedSecretKey()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const sendEvent = useSendEvent()
  const { openedNextStepModal } = useLoginModal()

  const isFinished = value.split(/[a-z]\s[a-z]/g).length === 12

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()

        if (openedNextStepModal?.step === 'save-grill-key') {
          openedNextStepModal.onFinish?.()
          return
        }
        if (value.trim() !== decodeSecretKey(encodedSecretKey ?? '')) {
          sendEvent('login_mnemonic_wrong')
          setError('The Grill key you entered is incorrect. Please try again.')
          return
        }
        if (provider === 'evm' || provider === 'polkadot') {
          closeModal()
        } else {
          setCurrentState('loading')
        }
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

function LoadingStep({}: ContentProps) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <DynamicLoadedHamsterLoading />
      <span className='text-sm text-text-muted'>
        It may take up to {estimatedWaitTime} seconds
      </span>
    </div>
  )
}

export const AccountCreatedStep = ({ closeModal }: ContentProps) => {
  const myAddress = useMyMainAddress()

  return (
    <div className='flex flex-col'>
      {myAddress && (
        <div
          className={cx(
            'mb-6 mt-2 flex flex-col rounded-2xl bg-background-lighter p-4'
          )}
        >
          <ProfilePreview
            address={myAddress}
            avatarClassName={cx('h-16 w-16')}
          />
        </div>
      )}
      <Button size='lg' onClick={() => finishLogin(closeModal)}>
        Continue
      </Button>
    </div>
  )
}
