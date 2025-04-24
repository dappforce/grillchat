import { isEmptyArray, isEmptyStr, nonEmptyStr } from '@subsocial/utils'
import Link from 'next/link'
import React from 'react'
import { IoPricetagOutline } from 'react-icons/io5'

type ViewTagProps = {
  tag?: string
}

const ViewTag = React.memo(({ tag }: ViewTagProps) => {
  const searchLink = `/search?tags=${tag}`

  return isEmptyStr(tag) ? null : (
    <div
      key={tag}
      className='rounded-md border border-gray-300 bg-gray-100 px-2 py-1 text-sm text-text-muted dark:border-gray-400 dark:bg-gray-700'
    >
      <Link
        href={searchLink}
        as={searchLink}
        className='flex items-center gap-2 hover:text-text-primary'
      >
        <IoPricetagOutline />
        {tag}
      </Link>
    </div>
  )
})

ViewTag.displayName = 'ViewTag'

type ViewTagsProps = {
  tags?: string[]
  className?: string
}

const ViewTags = React.memo(
  ({ tags = [], className = '', ...props }: ViewTagsProps) =>
    isEmptyArray(tags) ? null : (
      <div
        className={`flex flex-wrap items-center gap-2 ${className}`}
        {...props}
      >
        {tags.filter(nonEmptyStr).map((tag: string, i: number) => (
          <ViewTag key={`${tag}-${i}`} tag={tag} />
        ))}
      </div>
    )
)

ViewTags.displayName = 'ViewTags'

export default ViewTags
