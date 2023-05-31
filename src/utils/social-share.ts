export const openNewWindow = (url: string) =>
  window.open(
    url,
    '_blank',
    'toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400',
  )

type OptionsType = {
  tags?: string[]
}

export const twitterShareUrl = (url: string, text?: string, options?: OptionsType) => {
  const tags = options?.tags
  const textVal = text ? `text=${text}` : ''

  return `https://twitter.com/intent/tweet?${textVal}&url=${url + '\n\n'}&hashtags=${[
      ...(tags || []),
    ]}&original_referer=${url}`
  
}
