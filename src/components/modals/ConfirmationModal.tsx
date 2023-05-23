import { useState } from 'react'
import Button, { ButtonProps } from '../Button'
import Modal, { ModalFunctionalityProps } from './Modal'

type ClickHandler = () => Promise<void> | void

export type ConfirmationModalProps = ModalFunctionalityProps & {
  title: string
  description?: string
  autoCloseAfterAction?: boolean
  primaryButton: {
    text?: string
    onClick?: ClickHandler
    variant?: ButtonProps['variant']
  }
  secondaryButton: {
    text?: string
    onClick?: ClickHandler
    variant?: ButtonProps['variant']
  }
}

export default function ConfirmationModal({
  title,
  description,
  primaryButton,
  secondaryButton,
  autoCloseAfterAction = true,
  ...props
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (clickHandler?: ClickHandler) => async () => {
    setIsLoading(true)
    await clickHandler?.()
    setIsLoading(false)
    autoCloseAfterAction && props.closeModal()
  }

  return (
    <Modal {...props} title={title} description={description} withCloseButton>
      <div className='mt-2 flex flex-col gap-4'>
        <Button
          isLoading={isLoading}
          size='lg'
          variant={primaryButton?.variant ?? 'primary'}
          onClick={handleClick(primaryButton?.onClick)}
        >
          {primaryButton.text ?? 'Yes'}
        </Button>
        <Button
          isLoading={isLoading}
          size='lg'
          variant={secondaryButton?.variant ?? 'primaryOutline'}
          onClick={handleClick(secondaryButton?.onClick)}
        >
          {secondaryButton?.text ?? 'No'}
        </Button>
      </div>
    </Modal>
  )
}
