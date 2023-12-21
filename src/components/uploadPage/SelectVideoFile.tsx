//@ts-nocheck
import { useSelectedMediaContext } from '@/context/MediaFormContext'
import { useRef } from 'react'
export default function SelectVideoFile() {
  const videoRef = useRef<HTMLInputElement>(null)
  const { selectedVideo, setSelectedVideo, selectedImage, setSelectedImage } =
    useSelectedMediaContext()

  const handleVideoChange = (event: any) => {
    const video = event.target.files[0]
    setSelectedVideo(video)
  }

  const handleOpenInput = () => {
    videoRef?.current.click()
  }
  return (
    <div className=' flex h-[80vh] items-center justify-center'>
      <div className='flex h-[400px] w-[650px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-400 dark:border-gray-700 '>
        <input
          type='file'
          id='fileInput'
          accept='.mp4, .avi, .mov, .mkv, .wmv'
          onChange={handleVideoChange}
          //onDrop={(e) => handleSelectFile(e.target.files[0])}
          ref={videoRef}
          hidden
          className={`relative  h-full w-full bg-yellow-400`}
        />
        <div className='absolute flex flex-col items-center justify-center gap-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-20 w-20'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>

          <h1 className='text-center text-3xl font-bold'>
            Drag and Drop File <br /> Video to Upload
          </h1>
          <button
            className='rounded-lg border border-gray-500 px-4 py-2 font-semibold hover:rounded-xl dark:text-white'
            onClick={handleOpenInput}
          >
            Or Choose File
          </button>
        </div>
      </div>
    </div>
  )
}
