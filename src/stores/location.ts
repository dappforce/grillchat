import { Router } from 'next/router'
import { create, createSelectors } from './utils'

let histories: string[] = []
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

const useLocationBase = create<State>()((set, get) => ({
  ...initialState,
  init: () => {
    set({ currentUrl: window.location.href })
    startHistoryLength = window.history.length

    Router.events.on('routeChangeComplete', () => {
      const prevUrl = get().currentUrl
      const trackedHistoryLength = startHistoryLength + histories.length

      const isPopped = trackedHistoryLength > window.history.length
      const isReplaced = trackedHistoryLength === window.history.length
      if (isPopped) {
        histories.pop()
      } else if (isReplaced) {
        if (histories.length > 0) {
          histories.pop()
          histories.push(prevUrl)
        }
      } else {
        histories.push(prevUrl)
      }

      const lastHistory = histories[histories.length - 1]
      set({
        currentUrl: window.location.href,
        prevUrl: lastHistory,
        isFirstAccessed: false,
      })
    })
  },
}))
export const useLocation = createSelectors(useLocationBase)
