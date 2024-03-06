export type BackerInfoProps = {
  reload?: boolean
  ids: string[]
  account: string
}

export type BackerInfo = {
  totalStaked: string
  stakes: any[]
}