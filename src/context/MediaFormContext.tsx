// contexts/SelectionContext.js
import React, { createContext, useContext, useState } from 'react'

const SelectedMediasContext = createContext<any>(undefined)

type providerProps = {
  children: React.ReactNode
}
export const SelectedMediaProvider = ({ children }: providerProps) => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideoCID, setselectedVideoCID] = useState()

  const contextValue = {
    selectedVideo,
    setSelectedVideo,
    selectedImage,
    setSelectedImage,
    selectedVideoCID,
    setselectedVideoCID,
  }

  return (
    <SelectedMediasContext.Provider value={contextValue}>
      {children}
    </SelectedMediasContext.Provider>
  )
}

export const useSelectedMediaContext = () => {
  return useContext(SelectedMediasContext)
}
