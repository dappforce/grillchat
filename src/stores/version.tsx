import Button from '@/components/Button'
import Toast from '@/components/Toast'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { IoRefresh } from 'react-icons/io5'
import { create } from './utils'

type State = {
  version: string | undefined
}

const initialState: State = {
  version: undefined,
}

export const useVersion = create<State>()((set, get) => ({
  ...initialState,
  init: async () => {
    const fetchVersion = async () => {
      const response = await axios.get('/api/version')
      const newVersion = response.data
      const currentVersion = get().version

      if (currentVersion !== undefined && currentVersion !== newVersion) {
        toast.custom(
          (t) => (
            <Toast
              t={t}
              action={
                <Button
                  size='circle'
                  className='ml-2'
                  onClick={() => window.location.reload()}
                >
                  <IoRefresh />
                </Button>
              }
              title='🎉 We have new version!'
              description='Please reload the page to get the latest version.'
            />
          ),
          {
            duration: Infinity,
          }
        )
      }
      set({ version: newVersion })
    }
    fetchVersion()

    const INTERVAL = 10 * 60 * 1000 // 10 minutes
    setInterval(() => {
      fetchVersion()
    }, INTERVAL)
  },
}))
