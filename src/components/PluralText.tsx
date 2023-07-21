import { ComponentProps } from 'react'

type PluralTextParams = {
  count: number | undefined | null
  singular: string
  plural: string
}
export type PluralTextProps = ComponentProps<'span'> & PluralTextParams

export function getPluralText({ count, plural, singular }: PluralTextParams) {
  if (!count || count === 1) return singular
  return plural
}

export default function PluralText({
  count,
  plural,
  singular,
  ...props
}: PluralTextProps) {
  return <span {...props}>{getPluralText({ count, plural, singular })}</span>
}
