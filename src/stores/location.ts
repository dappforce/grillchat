import { Router } from 'next/router'
import { create } from './utils'

let history: string[] = []
let startHistoryLength: number

type State = {
  currentUrl: string
  prevUrl: string | undefined
}

const initialState: State = {
  currentUrl: '',
  prevUrl: undefined,
}

export const useLocation = create<State>()((set, get) => ({
  ...initialState,
  init: () => {
    set({ currentUrl: window.location.href })
    Router.events.on('routeChangeComplete', () => {
      if (startHistoryLength === undefined) {
        startHistoryLength = window.history.length
      }

      const prevUrl = get().currentUrl
      if (startHistoryLength + history.length > window.history.length) {
        history.pop()
      } else {
        history.push(prevUrl)
      }

      const lastHistory = history[history.length - 1]
      set({
        currentUrl: window.location.href,
        prevUrl: lastHistory,
      })
    })
  },
}))
