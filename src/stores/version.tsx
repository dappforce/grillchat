import Button from '@/components/Button'
import Toast from '@/components/Toast'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { IoClose, IoRefresh } from 'react-icons/io5'
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
              icon={(classNames) => (
                <HiOutlineInformationCircle className={classNames} />
              )}
              action={
                <div className='ml-2 flex items-center gap-1'>
                  <Button
                    size='circle'
                    className='ml-2'
                    onClick={() => window.location.reload()}
                  >
                    <IoRefresh />
                  </Button>
                  <Button
                    size='circle'
                    variant='transparent'
                    className='ml-2'
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <IoClose />
                  </Button>
                </div>
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
