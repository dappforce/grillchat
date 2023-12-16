import { fakeArray } from '@/assets/constant'

export default function ThumbnailsLoadingSpinner() {
  return (
    <div className='flex flex-wrap gap-2'>
      {fakeArray.map((item, i) => {
        return (
          <div
            className='flex-grow-2 flex  h-full  flex-shrink animate-pulse flex-col justify-center'
            key={i}
          >
            <div className=' mb-1 h-[70px] w-[120px] rounded-xl  border border-gray-300 bg-gray-300 dark:bg-gray-800 '></div>
          </div>
        )
      })}
    </div>
  )
}
