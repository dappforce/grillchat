import { useSelectedMediaContext } from '@/context/MediaFormContext'
import SelectVideoFile from './SelectVideoFile'
import VideoMetadata from './VideoMetadata'
export default function UploadPage() {
  // const [videoFile, setvideoFile] = useState();
  const { selectedVideo, setSelectedVideo, selectedImage, setSelectedImage } =
    useSelectedMediaContext()
  console.log('the selected file', selectedVideo)
  return (
    <div className=' flex min-h-screen items-center justify-center px-2'>
      {selectedVideo ? (
        <VideoMetadata
          videoFile={selectedVideo}
          setVideoFile={setSelectedVideo}
        />
      ) : (
        <SelectVideoFile />
      )}
    </div>
  )
}
