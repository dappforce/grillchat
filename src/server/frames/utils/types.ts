import { Frog } from 'frog'
export type FrameDefinition = {
  name: string
  src: Array<{
    path: string
    handler: (app: Frog) => void
  }>
}
