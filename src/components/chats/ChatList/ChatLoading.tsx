export default function ChatLoading() {
  return (
    <div className='flex items-center justify-center gap-4 overflow-hidden py-2'>
      <div className='relative h-4 w-4'>
        <div className='absolute inset-0 h-4 w-4 animate-spin rounded-full border-b-2 border-background-lighter' />
      </div>
      <span className='text-sm text-text-muted'>Loading...</span>
    </div>
  )
}
