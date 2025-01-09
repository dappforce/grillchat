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
      className='mt-2 rounded-md border border-gray-400 bg-gray-300 p-1'
    >
      <Link href={searchLink} as={searchLink}>
        <a className='DfGreyLink'>
          <IoPricetagOutline />
          {tag}
        </a>
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
      <div className={`DfTags ${className}`} {...props}>
        {tags.filter(nonEmptyStr).map((tag: string, i: number) => (
          <ViewTag key={`${tag}-${i}`} tag={tag} />
        ))}
      </div>
    )
)

ViewTags.displayName = 'ViewTags'

export default ViewTags
