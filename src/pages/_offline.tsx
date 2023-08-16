import Button from '@/components/Button'
import Logo from '@/components/Logo'

export default function OfflinePage() {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-background px-8 text-center'>
      <div className='flex flex-col gap-4'>
        <Logo className='text-5xl' />
        <p className='mt-4 text-2xl'>You are currently offline 🥲</p>
        <p>If you are back online, you can try to refresh the page.</p>
        <Button
          className='mx-auto mt-4 block'
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>
    </div>
  )
}
