import Button, { ButtonProps } from '@/components/Button'
import DataCard, { DataCardProps } from '@/components/DataCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image from 'next/image'
import { IconType } from 'react-icons'

type Action = {
  text: string
  icon: IconType
  iconClassName?: string
  className?: string
  iconClassName?: string
  onClick: ButtonProps['onClick']
  disabled?: boolean
}
export type AboutModalProps = ModalFunctionalityProps & {
  title: string | undefined
  image: string | undefined
  isImageCircle?: boolean
  subtitle: string
  contentList: DataCardProps['data']
  actionMenu?: Action[]
  bottomElement?: JSX.Element | null
}

export default function AboutModal({
  title,
  subtitle,
  isImageCircle = true,
  image,
  contentList,
  actionMenu,
  bottomElement,
  ...props
}: AboutModalProps) {
  return (
    <Modal {...props} withCloseButton>
      <div className='mt-4 flex flex-col items-center gap-4'>
        <div className='flex flex-col items-center text-center'>
          <Image
            src={getIpfsContentUrl(image ?? '')}
            className={cx(
              getCommonClassNames('chatImageBackground'),
              isImageCircle ? 'rounded-full' : 'rounded-2xl',
              'h-20 w-20'
            )}
            height={80}
            width={80}
            alt=''
          />
          <h1 className='mt-4 text-2xl font-medium'>{title}</h1>
          <span className='text-text-muted'>{subtitle}</span>
        </div>
        <DataCard data={contentList} />
        {actionMenu && actionMenu.length > 0 && (
          <div className='w-full overflow-hidden rounded-2xl bg-background-lighter'>
            {actionMenu.map(
              ({
                icon: Icon,
                iconClassName,
                text,
                className,
                onClick,
                disabled,
              }) => (
                <Button
                  disabled={disabled}
                  variant='transparent'
                  interactive='none'
                  size='noPadding'
                  key={text}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
                    'transition hover:bg-background-lightest focus-visible:bg-background-lightest',
                    className
                  )}
                  onClick={onClick}
                >
                  <Icon className={cx('text-xl', iconClassName)} />
                  <span>{text}</span>
                </Button>
              )
            )}
          </div>
        )}
        {bottomElement}
      </div>
    </Modal>
  )
}
