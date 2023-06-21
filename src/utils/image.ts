import Compressor from 'compressorjs'

export function resizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    new Compressor(file, {
      maxWidth: 1024,
      maxHeight: 1024,
      success: (file) => {
        resolve(file as File)
      },
    })
  })
}
