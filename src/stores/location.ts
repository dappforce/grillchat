import { Router } from 'next/router'
import { create } from './utils'

let history: string[] = []
let startHistoryLength: number

type State = {
  currentUrl: string
  prevUrl: string | undefined
  isFirstAccessed: boolean
}

const initialState: State = {
  currentUrl: '',
  prevUrl: undefined,
  isFirstAccessed: true,
}

export const useLocation = create<State>()((set, get) => ({
  ...initialState,
  init: () => {
    set({ currentUrl: window.location.href })
    startHistoryLength = window.history.length

    Router.events.on('routeChangeComplete', () => {
      const prevUrl = get().currentUrl
      const trackedHistoryLength = startHistoryLength + history.length

      const isPopped = trackedHistoryLength > window.history.length
      const isReplaced = trackedHistoryLength === window.history.length
      if (isPopped) {
        history.pop()
      } else if (isReplaced) {
        if (history.length > 0) {
          history.pop()
          history.push(prevUrl)
        }
      } else {
        history.push(prevUrl)
      }

      const lastHistory = history[history.length - 1]
      set({
        currentUrl: window.location.href,
        prevUrl: lastHistory,
        isFirstAccessed: false,
      })
    })
  },
}))
