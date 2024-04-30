export default function ChatContent() {
  return (
    <div
      className='sticky top-14 -mr-4 hidden flex-col border-x border-border-gray bg-white lg:flex'
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <div className='flex place-items-center justify-between border-b border-border-gray px-2.5 py-2'>
        <span className='text-lg font-semibold'>Meme2earn</span>
      </div>
      <div className='flex flex-1 flex-col'>Chat content</div>
    </div>
  )
}
