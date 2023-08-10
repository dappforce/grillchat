import { ReactNode, useState } from 'react'
import Button, { ButtonProps } from '../Button'
import Modal, { ModalFunctionalityProps } from './Modal'

type ClickHandler = () => Promise<void> | void

export type ConfirmationModalProps = ModalFunctionalityProps & {
  title: string
  description?: string
  content?: () => ReactNode
  autoCloseAfterAction?: boolean
  primaryButtonProps: ButtonProps & { onClick?: ClickHandler }
  secondaryButtonProps: ButtonProps & { onClick?: ClickHandler }
}

export default function ConfirmationModal({
  title,
  description,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  autoCloseAfterAction = true,
  ...props
}: ConfirmationModalProps) {
  const [isLoadingPrimary, setIsLoadingPrimary] = useState(false)
  const [isLoadingSecondary, setIsLoadingSecondary] = useState(false)

  const handleClick =
    (
      clickHandler: ClickHandler | undefined,
      buttonType: 'primary' | 'secondary'
    ) =>
    async () => {
      const setIsLoading =
        buttonType === 'primary' ? setIsLoadingPrimary : setIsLoadingSecondary

      setIsLoading(true)
      await clickHandler?.()
      setIsLoading(false)
      autoCloseAfterAction && props.closeModal()
    }

  return (
    <Modal {...props} title={title} description={description} withCloseButton>
      <div className='mt-2 flex flex-col gap-4'>
        {content?.()}
        <Button
          isLoading={isLoadingPrimary}
          disabled={isLoadingSecondary}
          size='lg'
          variant={primaryButtonProps?.variant ?? 'primary'}
          {...primaryButtonProps}
          onClick={handleClick(primaryButtonProps?.onClick, 'primary')}
        >
          {primaryButtonProps.children ?? 'Yes'}
        </Button>
        <Button
          isLoading={isLoadingSecondary}
          disabled={isLoadingPrimary}
          size='lg'
          variant={secondaryButtonProps?.variant ?? 'primaryOutline'}
          onClick={handleClick(secondaryButtonProps?.onClick, 'secondary')}
        >
          {secondaryButtonProps.children ?? 'No'}
        </Button>
      </div>
    </Modal>
  )
}
