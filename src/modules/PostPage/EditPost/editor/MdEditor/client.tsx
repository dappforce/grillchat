import { LocalStorage } from '@/utils/storage'
import { nonEmptyStr } from '@subsocial/utils'
import SimpleMDE from 'easymde'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import sanitizeHtml from 'sanitize-html'
import { AutoSaveId, MdEditorProps } from './types'
const SimpleMDEReact = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

const getStoreKey = (id: AutoSaveId) => `smde_${id}`

const store = new LocalStorage((id: string) => id)

/** Get auto saved content for MD editor from the browser's local storage. */
const getAutoSavedContent = (id?: AutoSaveId): string | null => {
  return id ? store.get(getStoreKey(id)) : null
}

export const clearAutoSavedContent = (id: AutoSaveId) =>
  store.remove(getStoreKey(id))

const AUTO_SAVE_INTERVAL_MILLIS = 5000

const MdEditor = ({
  className,
  options = {},
  events = {},
  onChange = () => void 0,
  value,
  autoSaveId,
  autoSaveIntervalMillis = AUTO_SAVE_INTERVAL_MILLIS,
  ...otherProps
}: MdEditorProps) => {
  const { toolbar = true, ...otherOptions } = options

  const autosavedContent = getAutoSavedContent(autoSaveId)

  const classToolbar = !toolbar && 'hideToolbar'

  const autosave = autoSaveId
    ? {
        enabled: true,
        uniqueId: autoSaveId,
        delay: autoSaveIntervalMillis,
      }
    : undefined

  const newOptions = {
    previewClass: 'markdown-body',
    placeholder: 'Write something...',
    autosave,
    status: [],
    spellChecker: false,
    toolbarTips: true,
    toolbar: [
      'bold',
      'italic',
      'heading-2',
      'unordered-list',
      'code',
      'quote',
      'horizontal-rule',
      'link',
      'upload-image',
      '|',
      'preview',
    ],
    uploadImage: true,
    shortcuts: { toggleFullScreen: null, toggleSideBySide: null },
    renderingConfig: {
      sanitizerFunction: (html: string) =>
        sanitizeHtml(html, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'del']),
        }),
    },
    ...otherOptions,
  } as SimpleMDE.Options

  useEffect(() => {
    if (autosave && nonEmptyStr(autosavedContent)) {
      // Need to trigger onChange event to notify a wrapping Ant D. form
      // that this editor received a value from local storage.
      onChange(autosavedContent)
    }
  }, [])

  const setFocus = (md: SimpleMDE) =>
    newOptions.autofocus && md.codemirror.focus()

  return (
    <SimpleMDEReact
      className={`DfMdEditor ${classToolbar} ${className}`}
      value={value}
      events={events}
      onChange={onChange}
      options={newOptions}
      getMdeInstance={setFocus}
      {...otherProps}
    />
  )
}

export default MdEditor
