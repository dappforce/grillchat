import RelatedVideoLosderSkelton from './RelatedVideoCardSpinner'

export default function VideoFullSkeleton() {
  return (
    <div className='flex gap-2 xl:w-[73vw] '>
      <div className='flex h-full  flex-shrink  flex-grow animate-pulse flex-col justify-center '>
        <div className=' mb-1  rounded-lg bg-gray-300 dark:bg-gray-700 xs:h-[200px] xs:w-[100vw]  md:w-[80vw] lg:h-[90vh]  lg:w-[90vw] xl:w-[73vw] '></div>
        <div className='mt-3 h-[25px] w-[350px] rounded-md bg-gray-300 dark:bg-gray-700'></div>
        <div className='flex justify-between xs:flex-col md:flex-row md:items-center'>
          <div className='mt-3 flex gap-3 px-5'>
            <div className='h-[18px] w-[100px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[18px] w-[100px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[18px] w-[100px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[18px] w-[100px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
          </div>
          <div className='my-4 flex gap-3 px-3'>
            <div className='h-[40px] w-[40px] rounded-2xl bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[40px] w-[40px] rounded-2xl bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[40px] w-[40px] rounded-2xl bg-gray-300 dark:bg-gray-700'></div>
            <div className='h-[40px] w-[40px] rounded-2xl bg-gray-300 dark:bg-gray-700'></div>
          </div>
        </div>
        <div className='mt-3 flex justify-between px-5'>
          <div className='h-[50px] w-[50px] rounded-full bg-gray-300 dark:bg-gray-700'></div>
          <div className='h-[30px] w-[110px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
        </div>
      </div>

      <RelatedVideoLosderSkelton />
    </div>
  )
}
