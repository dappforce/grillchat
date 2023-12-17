import { LIVEPEER_KEY } from '@/assets/constant'
import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
  ThemeConfig,
} from '@livepeer/react'
import React, { useState } from 'react'
import Navbar from './navbar/Navbar'
import Sidebar from './sidebar/Sidebar'
type layoutProps = {
  children: React.ReactNode
}

// LIVEPEER THEME
const livepeerTheme: ThemeConfig = {
  colors: {
    accent: '#f43f5e',
    containerBorderColor: '#3730a3',
  },
  fonts: {
    display: 'Inter',
  },
  radii: {
    containerBorderRadius: '16px',
  },
}
//LIVEPEER_CONFIGURATIONS
const client = createReactClient({
  provider: studioProvider({ apiKey: LIVEPEER_KEY }),
})

export default function Layout({ children }: layoutProps) {
  const [isShowFull, setisShowFull] = useState(false)

  const toggleShowModal = () => {
    setisShowFull(!isShowFull)
  }

  return (
    <html lang='en'>
      <LivepeerConfig client={client} theme={livepeerTheme}>
        <body>
          <div className='sticky top-0 z-30'>
            <Navbar isShowFull={isShowFull} toggleSidebar={toggleShowModal} />
          </div>

          <div className='flex gap-2'>
            <div>
              <Sidebar
                isShowFull={isShowFull}
                toggleSidebar={toggleShowModal}
              />
            </div>

            <div className='min-h-screen w-full'>{children}</div>
          </div>
        </body>
      </LivepeerConfig>
    </html>
  )
}
