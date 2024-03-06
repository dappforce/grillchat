import Compressor from 'compressorjs'

const MAX_IMAGE_SIZE = 300 * 1024 // 300KB
export function resizeImage(file: File): Promise<File> | File {
  if (file.size < MAX_IMAGE_SIZE) return file

  return new Promise((resolve) => {
    new Compressor(file, {
      maxWidth: 1600,
      maxHeight: 900,
      // images with size larger than this will be converted to jpeg
      convertSize: MAX_IMAGE_SIZE,
      convertTypes: ['image/png', 'image/gif'],
      success: (file) => {
        resolve(file as File)
      },
    })
  })
}
