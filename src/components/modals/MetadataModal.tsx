import { CopyTextInline } from '@/components/CopyText'
import Modal, { ModalFunctionalityProps } from '@/components/Modal'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl, getSubIdUrl } from '@/utils/ipfs'
import { PostData } from '@subsocial/api/types'
import { HiArrowUpRight } from 'react-icons/hi2'
import LinkText from '../LinkText'

export type MetadataModalProps = ModalFunctionalityProps & {
  post: PostData
  postIdTextPrefix?: string
}

export default function MetadataModal({
  post,
  postIdTextPrefix = 'Post',
  ...props
}: MetadataModalProps) {
  const metadataList: {
    title: string
    text: string
    link?: string
    openInNewTab?: boolean
  }[] = [
    { title: `${postIdTextPrefix} ID:`, text: post.id },
    {
      title: 'Content ID:',
      text: post.struct.contentId ?? '',
      link: getIpfsContentUrl(post.struct.contentId ?? ''),
      openInNewTab: true,
    },
    {
      title: 'Owner:',
      text: post.struct.ownerId ?? '',
      link: getSubIdUrl(post.struct.ownerId ?? ''),
      openInNewTab: true,
    },
  ]

  return (
    <Modal {...props} title='Metadata' withCloseButton>
      <div className='flex flex-col gap-4'>
        {metadataList.map(({ text, title, link, openInNewTab }, idx) => {
          const isLastElement = idx === metadataList.length - 1
          const textClassName = cx(
            'max-w-[calc(100%_-_2rem)] whitespace-pre-wrap break-words font-normal'
          )
          let textElement = <span className={textClassName}>{text}</span>
          if (link) {
            textElement = (
              <LinkText
                variant='secondary'
                href={link}
                openInNewTab={openInNewTab}
                className={cx(textClassName)}
              >
                {text} {openInNewTab && <HiArrowUpRight className='inline' />}
              </LinkText>
            )
          }

          return (
            <div className='flex flex-col gap-1' key={title}>
              <span className={cx('text-sm text-text-muted')}>{title}</span>
              <div className='flex items-center justify-between'>
                {textElement}
                <CopyTextInline
                  tooltipPlacement={isLastElement ? 'top' : 'bottom'}
                  className='max-w-full'
                  textContainerClassName={cx(
                    'max-w-[calc(100%_-_2rem)] whitespace-pre-wrap break-words'
                  )}
                  text={null}
                  textToCopy={text}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
