// contexts/SelectionContext.js
import { useCreateAsset } from '@livepeer/react'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
const SelectedMediasContext = createContext<any>(undefined)

type providerProps = {
  children: React.ReactNode
}
export const SelectedMediaProvider = ({ children }: providerProps) => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideoCID, setselectedVideoCID] = useState()
  const [videoProgress, setvideoProgress] = useState()

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
    isLoading: isUploadingVideo,
  } = useCreateAsset(
    selectedVideo
      ? {
          sources: [
            {
              name: selectedVideo?.name,
              file: selectedVideo,
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

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === 'failed'
        ? 'Failed to process video.'
        : progress?.[0].phase === 'waiting'
        ? 'Waiting'
        : progress?.[0].phase === 'uploading'
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === 'processing'
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress]
  )

  const handleUploadVideoFile = () => {
    if (!assets && !selectedVideoCID && !isUploadingVideo && selectedVideo) {
      createAsset?.()
    }
  }

  useEffect(() => {
    handleUploadVideoFile()
  }, [selectedVideo, assets, isUploadingVideo])

  const contextValue = {
    selectedVideo,
    setSelectedVideo,
    selectedImage,
    setSelectedImage,
    selectedVideoCID,
    setselectedVideoCID,
    isUploadingVideo,
    videoProgress,
    setvideoProgress,
    assets,
    progressFormatted,
  }

  console.log('the asset it self', assets)

  return (
    <SelectedMediasContext.Provider value={contextValue}>
      {children}
    </SelectedMediasContext.Provider>
  )
}

export const useSelectedMediaContext = () => {
  return useContext(SelectedMediasContext)
}
