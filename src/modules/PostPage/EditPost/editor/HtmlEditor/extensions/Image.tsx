import Image from '@tiptap/extension-image'
import { Plugin } from 'prosemirror-state'

export type UploadFn = (image: File) => Promise<string>

export const uploadImagePlugin = (upload: UploadFn) => {
  return new Plugin({
    props: {
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || [])
        const {
          schema,
          selection: { from, to },
        } = view.state

        items.forEach(async (item) => {
          const image = item.getAsFile()

          if (item.type.indexOf('image') === 0) {
            event.preventDefault()

            if (upload && image) {
              const imgNode = schema.nodes.image.create({
                src: await upload(image),
              })
              const pNode = schema.nodes.paragraph.create()

              const transaction = view.state.tr
                .replaceSelectionWith(imgNode)
                .replaceRangeWith(from, to, pNode)

              view.dispatch(transaction)
            }
          }
        })

        return false
      },
      handleDOMEvents: {
        drop(view, event) {
          const hasFiles = event.dataTransfer?.files?.length

          if (!hasFiles) {
            return false
          }

          const images = Array.from(event!.dataTransfer!.files).filter((file) =>
            /image/i.test(file.type)
          )

          if (images.length === 0) {
            return false
          }

          event.preventDefault()

          const { schema } = view.state
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })

          images.forEach(async (image) => {
            if (upload) {
              const node = schema.nodes.image.create({
                src: await upload(image),
              })

              const transaction = view.state.tr.insert(coordinates!.pos, node)
              view.dispatch(transaction)
            }
          })
          return false
        },
      },
    },
  })
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export default Image.extend({
  addProseMirrorPlugins() {
    return [
      uploadImagePlugin(async (file: File) => {
        // const ipfs = getIpfs()
        // const cid = await ipfs.saveFileToOffchain(file)

        // return resolveIpfsUrl(cid)
        return URL.createObjectURL(file)
      }),
    ]
  },
})
