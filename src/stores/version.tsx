import Button from '@/components/Button'
import Toast from '@/components/Toast'
import { apiInstance } from '@/services/api/utils'
import { toast } from 'react-hot-toast'
import { IoRefresh } from 'react-icons/io5'
import { create, createSelectors } from './utils'

type State = {
  isToastVisible: boolean
  version: string | undefined
}

const initialState: State = {
  isToastVisible: false,
  version: undefined,
}

const useVersionBase = create<State>()((set, get) => ({
  ...initialState,
  init: async () => {
    const versionHandling = async () => {
      const currentVersion = get().version
      const res = await validateSameVersion(currentVersion)
      if (!res) return

      const { version, isSameVersion } = res
      set({ version })

      if (!isSameVersion && !get().isToastVisible) {
        set({ isToastVisible: true })
        notifyDifferentVersion(() => {
          window.location.reload()
          set({ isToastVisible: false })
        })
      }
    }

    versionHandling()

    const INTERVAL = 10 * 60 * 1000 // 10 minutes
    setInterval(() => {
      versionHandling()
    }, INTERVAL)
  },
}))
export const useVersion = createSelectors(useVersionBase)

async function validateSameVersion(currentVersion: string | undefined) {
  try {
    const response = await apiInstance.get('/api/version')
    const newVersion = response.data

    const isSameVersion =
      currentVersion === undefined || currentVersion === newVersion
    return {
      version: newVersion,
      isSameVersion,
    }
  } catch (e) {
    console.error(e)
  }
}

function notifyDifferentVersion(onClick?: () => void) {
  toast.custom(
    (t) => (
      <Toast
        t={t}
        action={
          <Button
            size='circle'
            className='text-lg'
            onClick={onClick ?? (() => window.location.reload())}
          >
            <IoRefresh />
          </Button>
        }
        icon={() => <span className='mr-1'>🎉</span>}
        title='Update available'
        description='Please reload the page to update Grill.'
      />
    ),
    {
      duration: Infinity,
    }
  )
}
