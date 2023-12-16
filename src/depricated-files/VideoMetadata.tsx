import { useEffect, useRef, useState } from 'react'
//import { Contract } from "crossbell";
import { useSelectedMediaContext } from '@/context/MediaFormContext'
import {
  generateVideoThumbnails,
  importFileandPreview,
} from '@rajesh896/video-thumbnails-generator'

//const contract = new Contract(window.ethereum)
import { LIVEPEER_KEY } from '@/assets/constant'
import { usePinToIpfs } from '@/hooks/usePinToIpfs'
import { useCreateAsset } from '@livepeer/react'
//import { ClipLoader } from "react-spinners";
import { ThumbnailsLoadingSpinner } from '../skeletons'

import useWindowSize from 'react-use/lib/useWindowSize'
//import Confetti from 'react-confetti'
console.log(' lice peer key', LIVEPEER_KEY)
export default function VideoMetadata({ videoFile, setVideoFile }: any) {
  const { selectedVideo, setSelectedVideo, selectedImage, setSelectedImage } =
    useSelectedMediaContext()

  const [videoTitle, setvideoTitle] = useState('')
  const [caption, setcaption] = useState('')
  const [videoTags, setVideoTags] = useState([])
  const [videoTag, setvideoTag] = useState('')
  const [isSenstive, setisSensitive] = useState('no')
  const [videoThumnail, setvideoThumnail] = useState()
  const [selectedThumbnail, setselectedThumbnail] = useState()
  const [pointedThumbail, setpointedThumbail] = useState()
  const [isGeneratingThumbnails, setisGeneratingThumbnails] = useState(true)
  const [videoThumbnails, setvideoThumbnails] = useState([])
  const [videoUrl, setvideoUrl] = useState('')
  const [isUploadingCover, setisUploadingCover] = useState(false)
  const [isVideoUploading, setisVideoUploading] = useState(false)
  const [isCreatingNote, setisCreatingNote] = useState(false)
  const [trueTest, settrueTest] = useState(true)
  const [isNotCreated, setisNotCreated] = useState(false)
  const [coverCID, setcoverCID] = useState()
  const { uploadToIpfs, isUploading, isUploadingError } = usePinToIpfs()

  const { width, height } = useWindowSize()
  const [testTruth, settestTruth] = useState(true)

  const toggleTruthTest = () => {
    settrueTest(!trueTest)
  }
  // const {postVideo} = usePostVideo()
  const selectThumbnailRef = useRef(null)
  // console.log("thumbnails ", videoThumbnails)
  //
  const addTag = (event: any) => {
    if (event.key === 'Enter' && videoTag.length > 1 && videoTags.length < 5) {
      setVideoTags([...videoTags, videoTag])
      setvideoTag('')
    }
  }

  console.log('uploading error', isUploadingError)

  //Remove  tag
  const removeTag = (index: any) => {
    setVideoTags([
      ...videoTags.filter((tags) => videoTags.indexOf(tags) !== index),
    ])
  }

  console.log('see this  is stored cid', selectedImage)

  /*
   =========================
   UPLOD VIDEO THUMBNAIL
   ==========================
   */
  const handleUploadThumbnail = async () => {
    if (selectedThumbnail || videoThumbnails) {
      const base64ToBlob = (base64String, type) => {
        try {
          const byteCharacters = atob(base64String)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          return new Blob([byteArray], { type: type })
        } catch (error) {
          if (error.name === 'InvalidCharacterError') {
            console.error('Invalid base64 string:', base64String)
            return null
          } else {
            throw error
          }
        }
      }

      // UPLOAD_VIDEO_COVER_TO_IPFS

      setisUploadingCover(true)
      const jpegBlob = base64ToBlob(
        selectedThumbnail?.replace(/^data:image\/(png|jpeg|jpg);base64,/, '') ||
          videoThumbnails[0]?.replace(
            /^data:image\/(png|jpeg|jpg);base64,/,
            ''
          ),
        'image/png'
      )
      const videoCoverCID = await uploadToIpfs(jpegBlob)
      setSelectedImage(videoCoverCID)
      console.log('the image cid', videoCoverCID)
      setcoverCID(videoCoverCID?.path)
      setisUploadingCover(false)
    }
  }

  useEffect(() => {
    handleUploadThumbnail()
  }, [selectedThumbnail, videoThumbnails])

  /* 
    ===============================
        END OF UPLOAD THUMBNAIL 
    ================================
    */

  /*
     ===============================
       GENERATE VIDEO  THUMBNAILS
     ==============================
     
     */

  useEffect(() => {
    if (videoFile) {
      importFileandPreview(videoFile).then((res) => {
        setvideoUrl(res)
      })
      generateVideoThumbnails(videoFile, 6)
        .then((res) => {
          setvideoThumbnails(res)
          setisGeneratingThumbnails(false)
          //setvidThunbnail(videoThumbnails[0])
        })
        .catch((error) => {
          alert(error)
        })
    }
  }, [videoFile])

  /*
     ===========================================
      END OF  GENERATE VIDEO  THUMBNAILS
     ========================================
     
     */

  /*
     ===============================
       RESET FORM FUNCTION
     ==============================
     
     */

  const handleReset = () => {
    setvideoTitle('')
    setcaption('')
    setVideoTags([])
    setVideoFile()
    setselectedThumbnail()
  }

  /*
     ===============================
       END OF RESET FUNCTION
     ==============================
     
     */

  /*
     ==================================
       LIVEPEER HOOK TO UPLOAD FILE
     ====================================
     
     */
  const {
    mutate: createAsset,
    data: assets,
    status,
    progress,
    error,
    isLoading,
  } = useCreateAsset(
    videoFile
      ? {
          sources: [
            {
              name: videoFile.name,
              file: videoFile,
              storage: {
                ipfs: true,
                metadata: {
                  name: 'interesting video',
                  description: 'a great description of the video',
                },
              },
            },
          ] as const,
        }
      : null
  )
  console.log('the progress of video', progress)
  console.log('the assets itsell', assets)
  console.log('the error when posting', error)

  /*
     ===========================================
       END OF LIVEPEER HOOK TO UPLOAD FILE
     ===========================================
     
     */
  /*
     ===============================
       CROSSBELL CONTRACT INSTACNCE
     ==============================
     
     */

  /*
     ======================================
      END OF CROSSBELL CONTRACT INSTANCE
     ======================================
     
     */

  /*
     ===============================
       UPLOAD VIDEO FUNCTION
     ==============================
     */
  const postVideo = async () => {
    //UPLOAD_VIDEO_TO_LIVEPEER
    setisVideoUploading(true)
    await createAsset()
    setisVideoUploading(false)
  }
  /*
     ===============================
       END UPLOAD VIDEO FUNCTION
     ==============================
     */
  /*
     ======================================
       POST_VIDEO AS NOTE TO CROSSBELL
     =======================================
     */
  /*const handleCreateNote = async () => {

       
    try{
    setisCreatingNote(true);
    const result = await postNote.mutate({
      metadata : {
      title: videoTitle,
      content: caption,
      tags: videoTags,
      sources: ["xTube_v1"],
      attachments: [
        {
          name: coverCID,
          address: assets[0]?.playbackId,
          alt: videoTitle,
          mime_type: videoFile?.type,
        },
      ],
    }});
    console.log("the note results", result);

    setisNotCreated(true);
      setisCreatingNote(false);
      /* =====================
      TODO
       Direct  the  creator to  video  page
      ====================*/
  /*toast({
        title : "video uploaded",
        description : "video uploaded succefully "
      })

      
    } catch (error) {
       /* =====================
      TODO
      TOASTIFY THE ERROR
      ====================*/
  /* console.log("something went wrong while uploading the video ", error)
      toast({
        title : "someting went wrong",
        description : "something went wrong while uploading video"
      })
    }
  };*/

  /*useEffect(() => {
    if (status === "success" && !isNotCreated) {
      handleCreateNote();
    }
  }, [status]);*/

  /*
     ======================================
       END POST_VIDEO AS NOTE TO CROSSBELL
     =======================================
     */

  /*
     ======================================
       GET CURRENT  UPLOADING STATE
     =======================================
     */
  const getCurrentUploadingState = () => {
    if (status === 'loading') {
      return 'Uploading Video'
    } else if (isCreatingNote) {
      return 'Posting Video'
    } else {
      return 'Post Video'
    }
  }

  /*
     ======================================
      END OF  GET CURRENT  UPLOADING STATE
     =======================================
     */

  return (
    <div className='  flex  items-center justify-center gap-3 xs:flex-col md:flex-row'>
      <div className='h-full  flex-1  px-3'>
        <div className='z-0  '>
          <video
            width={500}
            controls
            className='rounded-xl  '
            poster={selectedThumbnail}
          >
            <source src={URL.createObjectURL(videoFile)} />
          </video>
        </div>

        <div className='my-4 '>
          <h1 className='my-3 text-sm opacity-75'>THUMBNAILS</h1>
          <div className='flex flex-wrap gap-3'>
            <div className='flex h-[70px] w-[120px] flex-col items-center justify-center rounded-xl border border-gray-300'>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => setvideoThumnail(e.target.files[0])}
                ref={selectThumbnailRef}
                hidden
              />
              {videoThumnail ? (
                <img
                  src={URL.createObjectURL(videoThumnail)}
                  className='h-[100%] w-[100%] rounded-md object-cover'
                />
              ) : (
                <>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 4.5v15m7.5-7.5h-15'
                      onClick={() => {
                        selectThumbnailRef.current.click()
                      }}
                    />
                  </svg>

                  <h1 className='text-xs opacity-60'>Upload</h1>
                </>
              )}
            </div>

            {isGeneratingThumbnails && (
              <div className='flex items-center gap-2'>
                {' '}
                {/* <ClipLoader size={19} /> <p>Loading Thambnails</p>{" "}*/}
                <ThumbnailsLoadingSpinner />
              </div>
            )}
            {videoThumbnails?.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`h-[70px] w-[120px] cursor-pointer rounded-xl ${
                    pointedThumbail === i && 'rounded-xl ring-2 ring-blue-700'
                  } relative `}
                  onClick={() => {
                    setselectedThumbnail(item)
                    setpointedThumbail(i)
                  }}
                >
                  <img
                    src={item}
                    key={i}
                    className='h-full w-full rounded-xl object-cover'
                  />
                  {/*<div>
                          <h1 className='absolute top-[50%] left-[50%] right-[50%]'>loading</h1>
                      </div>*/}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className='h-full flex-1 px-4 py-2'>
        <div className='mb-3 flex flex-col gap-2'>
          <h1 className='text-sm opacity-75'>TITLE</h1>
          {/*isNotCreated && (
                <Confetti
                width={width}
                height={height}
              />
          )*/}

          <input
            value={videoTitle}
            onChange={(e) => setvideoTitle(e.target.value)}
            placeholder='Title that describes Your video'
            className='rounded-xl border border-gray-300 bg-inherit px-4 py-2 placeholder:text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:placeholder:text-gray-600'
          />
        </div>
        <div className='mb-3 flex flex-col gap-2'>
          <h1 className='text-sm opacity-75'>DESCRIPTION</h1>
          <textarea
            value={caption}
            onChange={(e) => setcaption(e.target.value)}
            placeholder='Description of your video'
            className='h-32 resize-none rounded-xl border border-gray-300 bg-inherit px-4 py-2 placeholder:text-sm focus:border-blue-500 focus:outline-none dark:border-gray-800 dark:placeholder:text-gray-600'
          />
        </div>
        <div className='my-3 h-32 rounded-xl border border-gray-300 px-4 py-2 dark:border-gray-700'>
          <h1 className='text-sm opacity-75'>TAGS</h1>
          <input
            value={videoTag}
            onChange={(e) => setvideoTag(e.target.value)}
            placeholder='Eg Music'
            onKeyUp={(event) => addTag(event)}
            className='h-9 w-full rounded-xl border border-gray-200 bg-inherit px-4 py-1 placeholder:text-sm focus:outline-none dark:border-gray-800 dark:placeholder:text-gray-600'
          />
          <div className='mt-2 flex flex-wrap gap-2'>
            {videoTags?.map((tag, i) => (
              <div
                className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1 text-white opacity-70'
                key={i}
              >
                <p>{tag}</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5 cursor-pointer'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                    onClick={() => removeTag(i)}
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h1 className='opacity-90'>
            Does this video contain sensitive information that targets an adult
            audience?
          </h1>
          <div className='flex gap-4'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='isSensitive'
                value='yes'
                checked={isSenstive === 'yes'}
                className='bg-inherit'
                onChange={() => setisSensitive('yes')}
              />
              Yes
            </label>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='radio'
                name='isSensitive'
                value='no'
                className='bg-inherit'
                checked={isSenstive === 'no'}
                onChange={() => setisSensitive('no')}
              />
              No
            </label>
          </div>
        </div>

        <div className='my-4 flex justify-end gap-4 text-sm'>
          <button onClick={handleReset}>Reset</button>
          <div
            className='flex cursor-pointer items-center gap-2 rounded-xl bg-black px-4 py-1.5 font-semibold  text-white dark:bg-white dark:text-black xl:py-2'
            onClick={postVideo}
          >
            {/*} <ClipLoader size={15} loading={isLoading || isCreatingNote} className="text-white dark:text-black"
             color="#e11d48"
            />*/}
            <button className=' rounded-lg   font-semibold'>
              {getCurrentUploadingState()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
