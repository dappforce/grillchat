import slugify from 'slugify'

const SLUG_SEPARATOR = '-'

export function getIdFromSlug(slug: string) {
  return slug.split(SLUG_SEPARATOR).pop()?.trim()
}

type Content = {
  body?: string
  title?: string
}
const MAX_SLUG_LENGTH = 60
export function createSlug(id: string, content: Content | undefined | null) {
  let slug = id
  const { body, title } = content || {}
  const text = title || body || ''
  const summary = summarize(text, true)
  if (summary) {
    slug = `${slugify(summary, { lower: true })}${SLUG_SEPARATOR}${id}`
  }
  return slug
}

export const summarize = (text: string, withoutOmission?: boolean): string => {
  if (!text) return ''

  text = text.trim()

  const limit = MAX_SLUG_LENGTH
  const omission = withoutOmission ? '' : '...'

  return text.length <= limit
    ? text
    : text.slice(0, limit - omission.length) + omission
}
