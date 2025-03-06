import { debounceFunction } from '@/utils/async'
import { BareProps } from '@/utils/types'
import { mdToHtml } from '@subsocial/utils'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Typography from '@tiptap/extension-typography'
import {
  EditorContent,
  generateHTML,
  generateJSON,
  JSONContent,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { CSSProperties, useCallback, useMemo } from 'react'
import { Embed } from './extensions/Embed'
import Image from './extensions/Image'

export const htmlToMd = (html?: string) =>
  html && /<\/?[a-z][\s\S]*>/.test(html)
    ? NodeHtmlMarkdown.translate(html, {
        emDelimiter: '*',
      })
    : html

export type TipTapEditorProps = {
  className?: string
  style?: CSSProperties
} & {
  onBlur: (html: string) => void
  value?: string
  placeholder?: string
  showToolbar?: boolean
  autoFocus?: boolean
  toolbarClassName?: string
  stickyToolbar?: boolean
  editorClassName?: string
}

const extensions = [
  StarterKit,
  // Highlight,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Image.configure({ inline: true }),
  Link.configure({
    autolink: false,
  }),
  Embed,
  Placeholder.configure({
    placeholder: 'Write something …',
  }),
]

type OnUpdateFn = (htmlText: string) => void

const regexToMatchCodeBlock = /(<pre><code>)([\s\S]+?)(?=<\/code><\/pre>)/g

export const useCreateEditor = (
  onUpdate: OnUpdateFn,
  content: any,
  saveBodyDraft: (body: string) => void = () => undefined
) => {
  const htmlContent = useMemo(() => {
    return mdToHtml(content)?.replace(
      regexToMatchCodeBlock,
      (_, start, content) => {
        return `${start}${content.trim()}`
      }
    )
  }, [content])

  const debouncedSaveDraft = useCallback(
    debounceFunction(saveBodyDraft, 250),
    []
  )

  return useEditor(
    {
      extensions,
      content: htmlContent || content,
      onUpdate: ({ editor }) => {
        debouncedSaveDraft(editor.getHTML())
        onUpdate(editor.getHTML())
      },
      autofocus: true,
    },
    []
  )
}

export const generateTipTapJson = (html: string): JSONContent =>
  generateJSON(html, extensions) as JSONContent
export const generateHtmlFromTipTapContent = (content: JSONContent): string =>
  generateHTML(content, extensions)

type TipTapViewerProps = BareProps & {
  html?: string
}

export const TipTapPreviewViewer = ({
  html,
  className,
  style,
}: TipTapViewerProps) => {
  return html ? (
    <div
      className={`ProseMirror ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : null
}

export const TipTapViewer = ({
  html = '',
  className,
  style,
}: TipTapViewerProps) => {
  const editor = useEditor({ editable: false, extensions, content: html })

  return <EditorContent editor={editor} className={className} style={style} />
}
