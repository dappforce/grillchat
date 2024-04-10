import LinkText from '@/components/LinkText'
import { isTouchDevice } from '@/utils/device'
import {
  PostData,
  SpaceStruct,
  PostContent as SubsocialPostContent,
} from '@subsocial/api/types'
import { createPostSlug, isEmptyStr, summarize } from '@subsocial/utils'
import Link from 'next/link'
import PostCover from './PostCover'

type PostContentProps = {
  space?: SpaceStruct
  post: PostData
}

const PostContent = ({ space, post }: PostContentProps) => {
  const postContent = post.content

  if (!postContent || (!postContent.body && !postContent.title)) {
    return <div className='mt-3' />
  }

  return (
    <Link
      href='/[spaceId]/[slug]'
      as={`${space?.id}/${createPostSlug(post.id, postContent)}`}
    >
      <div className='flex flex-col gap-2'>
        <PostCover post={post} />
        <PostTitle content={postContent} />
        <SummarizeMd post={post} space={space} />
      </div>
    </Link>
  )
}

type PostTitleProps = {
  content: SubsocialPostContent
}

const PostTitle = ({ content }: PostTitleProps) => {
  const title = content.title

  if (!title || isEmptyStr(title)) return null

  return <div className='text-lg font-bold leading-none text-text'>{title}</div>
}

type SummarizeMdProps = {
  post: PostData
  space?: SpaceStruct
}

const MOBILE_SUMMARY_LEN = 120
const DESKTOP_SUMMARY_LEN = 220

const SummarizeMd = ({ post, space }: SummarizeMdProps) => {
  const postContent = post.content

  const body = postContent?.body

  if (!postContent || !body || isEmptyStr(body)) return null

  const limit = isTouchDevice() ? MOBILE_SUMMARY_LEN : DESKTOP_SUMMARY_LEN

  const summary = summarize(body, { limit })
  let isShowMore = body.length > limit

  return (
    <span className='text-sm font-normal leading-normal'>
      {summary}{' '}
      {isShowMore && (
        <LinkText
          variant='primary'
          href='/[spaceId]/[slug]'
          as={`${space?.id}/${createPostSlug(post.id, postContent)}`}
        >
          View Post
        </LinkText>
      )}
    </span>
  )
}

export default PostContent
