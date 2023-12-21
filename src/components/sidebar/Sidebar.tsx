import { categories, sidebarNav } from '@/assets/constants'
import Link from 'next/link'

type sidebarprops = {
  isShowFull?: boolean
  toggleSidebar?: any
}
export default function Sidebar({ isShowFull }: sidebarprops) {
  return (
    <div className={`${!isShowFull && 'xs:hidden  '}  z-10    md:w-24 `}>
      <div
        className={`${
          isShowFull && 'fixed top-[50px] z-20 h-screen w-screen bg-black/70'
        }`}
      >
        <div
          className={`${
            isShowFull
              ? 'w-52 bg-white p-2 dark:bg-background '
              : 'items-center'
          } fixed flex h-screen flex-col bg-inherit  to-[50px]`}
        >
          {sidebarNav.map((item, i) => (
            <Link key={i} href={item.to}>
              <div
                className={`${
                  isShowFull
                    ? 'w-48  flex-row items-center gap-3 rounded-xl px-4 py-2'
                    : 'flex-col items-center'
                } my-1  flex px-4 py-3 hover:bg-gray-300/80  dark:hover:bg-gray-700`}
              >
                <item.icon
                  className={`${isShowFull ? 'h-4.5 w-3.5' : 'h-5 w-5'}`}
                />
                <p className='text-xs'>{item.title}</p>
              </div>
            </Link>
          ))}

          <div className='my-1 h-[0.6px] w-full bg-gray-700/30 dark:bg-gray-600'></div>
          {categories.map((item, i) => (
            <Link key={i} href={item.to}>
              <div
                className={`${
                  isShowFull
                    ? 'w-48  flex-row items-center gap-3 rounded-xl px-4 py-2'
                    : 'flex-col items-center'
                } my-1  flex px-4 py-3 hover:bg-gray-300/80  dark:hover:bg-gray-700`}
              >
                <item.icon
                  className={`${isShowFull ? 'h-4.5 w-3.5' : 'h-5 w-5'}`}
                />
                <p className='text-xs'>{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
