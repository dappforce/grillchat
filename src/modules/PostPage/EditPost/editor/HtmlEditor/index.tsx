import { EditorContent } from '@tiptap/react'
import ToolBar from './Toolbar'
import { useCreateEditor } from './tiptap'

export interface HTMLEditorProps {
  onChange?: (htmlText: string) => void
  value?: string
  saveBodyDraft?: (body: string) => void
  className?: string
  showToolbar?: boolean
  autoFocus?: boolean
}

export default function HtmlEditor({
  onChange = () => undefined,
  value,
  saveBodyDraft,
  className,
  showToolbar,
}: HTMLEditorProps) {
  const editor = useCreateEditor(onChange, value, saveBodyDraft)

  return (
    <>
      {showToolbar && <ToolBar editor={editor} />}
      <EditorContent
        autoFocus
        tabIndex={0}
        className={className}
        editor={editor}
      />
    </>
  )
}
