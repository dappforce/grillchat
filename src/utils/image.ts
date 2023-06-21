import Resizer from 'react-image-file-resizer'

export function resizeImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri as File)
      },
      'file'
    )
  })
}
