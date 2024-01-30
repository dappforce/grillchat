import Compressor from 'compressorjs'

export function resizeImage(file: File): Promise<File> | File {
  if (file.size < 1024 * 1024) return file

  return new Promise((resolve) => {
    new Compressor(file, {
      maxWidth: 1600,
      maxHeight: 1024,
      success: (file) => {
        resolve(file as File)
      },
    })
  })
}
