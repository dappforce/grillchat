import React from 'react'

type IconWithTitleProps = {
  icon: JSX.Element
  count?: number
  label?: string
  renderZeroCount?: boolean
  renderTextIfEmpty?: boolean
}

export const IconWithLabel = React.memo((props: IconWithTitleProps) => {
  const { icon, label, count = 0, renderZeroCount, renderTextIfEmpty } = props

  const countStr = renderZeroCount || count > 0 ? count.toString() : undefined

  const text = label ? label + (countStr ? ` (${countStr})` : '') : countStr

  return (
    <span className={'flex items-center gap-2'}>
      {icon}
      {(text || renderTextIfEmpty) && (
        <span className={'ml-2'}>{text || <span>&nbsp;</span>}</span>
      )}
    </span>
  )
})

IconWithLabel.displayName = 'IconWithLabel'
