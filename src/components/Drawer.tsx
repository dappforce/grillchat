import { IoMdClose } from 'react-icons/io'
import Button from './Button'

type DrawerProps = {
  children: React.ReactNode
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Drawer = ({ children, isOpen, setIsOpen }: DrawerProps) => {
  return (
    <main
      className={
        ' fixed inset-0 z-10 mt-[49px] transform overflow-hidden bg-gray-900 bg-opacity-25 ease-in-out ' +
        (isOpen
          ? ' translate-x-0 opacity-100 transition-opacity duration-500  '
          : ' translate-x-full opacity-0 transition-all delay-500  ')
      }
    >
      <section
        className={
          ' delay-400 absolute right-0 h-full w-screen max-w-lg transform bg-white shadow-xl transition-all duration-500 ease-in-out  ' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className='relative flex h-full w-screen max-w-lg flex-col space-y-6 overflow-y-scroll pb-10'>
          <header className='flex w-full justify-end p-4 text-lg font-bold'>
            <Button
              variant='transparent'
              size='circle'
              onClick={() => setIsOpen(false)}
            >
              <IoMdClose />
            </Button>
          </header>
          {children}
        </article>
      </section>
      <section
        className=' h-full w-screen cursor-pointer '
        onClick={() => {
          setIsOpen(false)
        }}
      ></section>
    </main>
  )
}

export default Drawer
