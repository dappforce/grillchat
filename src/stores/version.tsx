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
    const versionHandling = async () => {
      const currentVersion = get().version
      const res = await validateSameVersion(currentVersion)
      if (!res) return

      const { version, isSameVersion } = res
      set({ version })

      if (!isSameVersion) notifyDifferentVersion()
    }

    versionHandling()

    const INTERVAL = 10 * 60 * 1000 // 10 minutes
    setInterval(() => {
      versionHandling()
    }, INTERVAL)
  },
}))

async function validateSameVersion(currentVersion: string | undefined) {
  try {
    const response = await axios.get('/api/version')
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
        title='We have new version!'
        description='Please reload the page to get the latest version.'
      />
    ),
    {
      duration: Infinity,
    }
  )
}
