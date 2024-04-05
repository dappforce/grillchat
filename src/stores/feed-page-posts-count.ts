import { getHotPosts } from '@/services/datahub/hot-posts/query'
import { create, createSelectors } from './utils'

type State = {
  hotPostsCount: number
  latestPostsCount: number
}

type Actions = {
  setPostsCount: (props: Partial<State>) => void
  getHotPostsCount: () => Promise<number>
}

const INITIAL_STATE: State = {
  hotPostsCount: 0,
  latestPostsCount: 0,
}

const useFeedPagePostsCountBase = create<State & Actions>()((set, get) => ({
  ...INITIAL_STATE,
  getHotPostsCount: async () => {
    const storedData = get()

    if (!storedData.hotPostsCount) {
      const newHotPostsCount = await getHotPosts({
        limit: 0,
        offset: 0,
      })

      const total = newHotPostsCount.total

      set({
        ...storedData,
        hotPostsCount: total,
      })

      return total
    }

    return storedData.hotPostsCount
  },
  setPostsCount: (props) => {
    const storedData = get()

    set({
      ...storedData,
      ...props,
    })
  },
}))

export const useFeedPagePostsCount = createSelectors(useFeedPagePostsCountBase)
