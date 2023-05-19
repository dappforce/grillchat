import Button, { ButtonProps } from '@/components/Button'
import { CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image from 'next/image'
import { IconType } from 'react-icons'

type Content = {
  title: string
  content: string | undefined
  withCopyButton?: boolean
  redirectTo?: string
}
type Action = {
  text: string
  icon: IconType
  className?: string
  onClick: ButtonProps['onClick']
}
export type AboutModalProps = ModalFunctionalityProps & {
  title: string
  imageCid: string
  isImageCircle?: boolean
  subtitle: string
  contentList: Content[]
  actionMenu?: Action[]
}

export default function AboutModal({
  title,
  subtitle,
  isImageCircle = true,
  imageCid,
  contentList,
  actionMenu,
  ...props
}: AboutModalProps) {
  return (
    <Modal {...props} withCloseButton>
      <div className='mt-4 flex flex-col items-center gap-4'>
        <div className='flex flex-col items-center text-center'>
          <Image
            src={getIpfsContentUrl(imageCid)}
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
        <div className='flex w-full flex-col gap-3 rounded-2xl bg-background-lighter px-4 py-4'>
          {contentList.map(({ content, title, withCopyButton, redirectTo }) => {
            if (!content) return null
            const containerClassName = cx(
              'border-b border-background-lightest pb-3 last:border-none last:pb-0'
            )
            const element = (
              <div key={title} className={cx('flex flex-1 flex-col gap-0.5')}>
                <span className='text-sm text-text-muted'>{title}</span>
                {(() => {
                  if (redirectTo) {
                    return (
                      <LinkText
                        variant='secondary'
                        href={redirectTo}
                        openInNewTab
                      >
                        {content}
                      </LinkText>
                    )
                  } else if (withCopyButton) {
                    return (
                      <CopyTextInline
                        text={content}
                        withButton={false}
                        className='text-text-secondary'
                      />
                    )
                  }
                  return <span>{content}</span>
                })()}
              </div>
            )

            return (
              <div
                key={title}
                className={cx('flex w-full items-center', containerClassName)}
              >
                {withCopyButton ? (
                  <div className={cx('flex w-full items-center')}>
                    {element}
                    <div>
                      <CopyTextInline
                        textClassName='flex-1'
                        className='w-full'
                        textContainerClassName='w-full'
                        text={''}
                        textToCopy={content}
                      />
                    </div>
                  </div>
                ) : (
                  element
                )}
              </div>
            )
          })}
        </div>
        {actionMenu && actionMenu.length > 0 && (
          <div className='w-full overflow-hidden rounded-2xl bg-background-lighter'>
            {actionMenu.map(({ icon: Icon, text, className, onClick }) => (
              <Button
                variant='transparent'
                interactive='none'
                size='noPadding'
                key={text}
                className={cx(
                  'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
                  'transition focus-visible:bg-background-lightest hover:bg-background-lightest',
                  className
                )}
                onClick={onClick}
              >
                <Icon className='text-xl' />
                <span>{text}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
