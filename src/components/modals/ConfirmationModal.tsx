import { useState } from 'react'
import Button, { ButtonProps } from '../Button'
import Modal, { ModalFunctionalityProps } from './Modal'

type ClickHandler = () => Promise<void> | void

export type ConfirmationModalProps = ModalFunctionalityProps & {
  title: string
  description?: string
  autoCloseAfterAction?: boolean
  primaryButtonProps: ButtonProps & { onClick?: ClickHandler }
  secondaryButtonProps: ButtonProps & { onClick?: ClickHandler }
}

export default function ConfirmationModal({
  title,
  description,
  primaryButtonProps,
  secondaryButtonProps,
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
          variant={primaryButtonProps?.variant ?? 'primary'}
          {...primaryButtonProps}
          onClick={handleClick(primaryButtonProps?.onClick)}
        >
          {primaryButtonProps.children ?? 'Yes'}
        </Button>
        <Button
          isLoading={isLoading}
          size='lg'
          variant={secondaryButtonProps?.variant ?? 'primaryOutline'}
          onClick={handleClick(secondaryButtonProps?.onClick)}
        >
          {secondaryButtonProps.children ?? 'No'}
        </Button>
      </div>
    </Modal>
  )
}
