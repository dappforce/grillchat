import { Router } from 'next/router'
import { create } from './utils'

type State = {
  currentUrl: string
  prevUrl: string
}

const initialState: State = {
  currentUrl: '',
  prevUrl: '',
}

export const useLocation = create<State>()((set, get) => ({
  ...initialState,
  init: () => {
    set({ currentUrl: window.location.href })
    Router.events.on('routeChangeComplete', () => {
      const prevUrl = get().currentUrl
      set({ currentUrl: window.location.href, prevUrl })
    })
  },
}))
