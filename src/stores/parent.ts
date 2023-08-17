import { getUrlQuery } from '@/utils/links'
import { getIsInIframe, isPWA } from '@/utils/window'
import { create } from './utils'

type State = {
  parentOrigin: string
}

const initialState: State = {
  parentOrigin: 'grill-app',
}

export const useParentData = create<State>()((set) => ({
  ...initialState,
  init: async () => {
    const isInIframe = getIsInIframe()
    let parentOrigin = isPWA() ? 'grill-pwa' : 'grill-web'
    if (isInIframe) {
      parentOrigin = getUrlQuery('parent') || 'iframe'
    }

    set({ parentOrigin })
  },
}))
