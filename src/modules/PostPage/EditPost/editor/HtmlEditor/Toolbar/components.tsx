import { ChainedCommands, Editor } from '@tiptap/react'
import { Button, Form, Input, Modal, Tooltip } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { BiCodeCurly } from 'react-icons/bi'
import {
  FaBold,
  FaImage,
  FaItalic,
  FaLink,
  FaListUl,
  FaQuoteLeft,
} from 'react-icons/fa'
import { GoHorizontalRule } from 'react-icons/go'
import { EmbeddedLinkField } from 'src/components/posts/editor/Fileds'
import { UploadCover } from 'src/components/uploader'
import { SubIcon } from 'src/components/utils'

import { nonEmptyStr } from '@subsocial/utils'
import clsx from 'clsx'
import styles from '../editor.module.sass'

export const ToolbarBtn = React.memo(
  ({
    editor,
    onCommand,
    onClick: outerOnClick,
    icon,
    name,
    isActive,
  }: InnerToolbarBtnProps & HasEditorProps) => {
    if (!editor) return null

    const onClick = () => {
      outerOnClick && outerOnClick()

      onCommand && runCommand(editor, onCommand)
    }

    return (
      <Tooltip title={name} placement='bottom'>
        <Button
          type='text'
          size='middle'
          className={clsx({ [styles.DfIsActive]: isActive })}
          icon={icon}
          onClick={onClick}
        />
      </Tooltip>
    )
  }
)

ToolbarBtn.displayName = 'ToolbarBtn'

type RunCommandFn = (command: ChainedCommands) => ChainedCommands

export const UploadImageModal = React.memo((props: ToolbarComponent) => {
  const [open, setOpen] = useState(false)

  const { editor } = props

  if (!editor) return null

  const onChange = (cid?: string) => {
    if (cid) {
      runCommand(editor, (e) => e.setImage({ src: resolveIpfsUrl(cid) }))

      closeModal()
    }
  }

  const closeModal = () => setOpen(false)
  const openModal = () => setOpen(true)

  return (
    <>
      <ToolbarBtn {...props} onClick={openModal} />
      {open && (
        <Modal
          onCancel={closeModal}
          visible={open}
          width={600}
          title='Insert image'
          footer={<Button onClick={closeModal}>Cancel</Button>}
        >
          <UploadCover onChange={onChange} placeholder='Drag & drop an image' />
        </Modal>
      )}
    </>
  )
})

UploadImageModal.displayName = 'UploadImageModal'

export const CreateLinkModal = React.memo(
  (props: InnerToolbarBtnProps & HasEditorProps) => {
    const [open, setOpen] = useState(false)
    const [form] = Form.useForm()
    const { editor } = props
    const inputName = 'link'

    useEffect(() => {
      if (!open) return

      const node = editor?.getAttributes(inputName)
      form.setFieldsValue({ [inputName]: node?.href })
    }, [open])

    const closeModal = () => setOpen(false)
    const openModal = () => setOpen(true)

    const onClick = () => {
      const value = form.getFieldValue(inputName)

      if (editor) {
        runCommand(editor, (e) =>
          nonEmptyStr(value) ? e.setLink({ href: value }) : e.unsetLink()
        )
      }

      closeModal()
    }

    return (
      <>
        <ToolbarBtn {...props} onClick={openModal} />
        {open && (
          <Modal
            onCancel={closeModal}
            visible={open}
            width={600}
            title='Insert link'
            footer={
              <>
                <Button onClick={closeModal}>Cancel</Button>
                <Button type='primary' onClick={onClick}>
                  Insert
                </Button>
              </>
            }
          >
            <DfForm form={form} className='my-1'>
              <Form.Item
                name={inputName}
                label='URL'
                hasFeedback
                rules={[{ type: 'url', message: 'Should be a valid URL.' }]}
              >
                <Input type='url' autoFocus />
              </Form.Item>
            </DfForm>
          </Modal>
        )}
      </>
    )
  }
)

CreateLinkModal.displayName = 'CreateLinkModal'

export const CreateEmbedModal = React.memo((props: ToolbarComponent) => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const { editor } = props
  const inputName = 'link'

  useEffect(() => {
    if (!open) return

    const node = editor?.getAttributes(inputName)
    form.setFieldsValue({ [inputName]: node?.href })
  }, [open])

  const closeModal = () => setOpen(false)
  const openModal = () => setOpen(true)

  const onClick = () => {
    const value = form.getFieldValue(inputName) as string

    if (editor && value) {
      runCommand(editor, (e) => e.setEmbed({ src: value }))
    }

    closeModal()
    form.resetFields()
  }

  return (
    <>
      <ToolbarBtn {...props} onClick={openModal} />
      {open && (
        <Modal
          onCancel={closeModal}
          visible={open}
          width={600}
          title='Embed'
          footer={
            <>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type='primary' onClick={onClick}>
                Embed
              </Button>
            </>
          }
        >
          <DfForm form={form} className='my-1'>
            <EmbeddedLinkField form={form} autoFocus />
          </DfForm>
        </Modal>
      )}
    </>
  )
})

CreateEmbedModal.displayName = 'CreateEmbedModal'

export type HasEditorProps = {
  editor: Editor | null
}

export type InnerToolbarBtnProps = {
  name: string
  onCommand?: (command: ChainedCommands) => ChainedCommands
  onClick?: () => void
  icon: React.ReactNode
  isActive?: boolean
}

export const createCommand = (editor: Editor, command: RunCommandFn) =>
  command(editor.chain().focus())
export const runCommand = (editor: Editor, command: RunCommandFn) =>
  createCommand(editor, command).run()

type ToolbarBtnProps = Omit<InnerToolbarBtnProps, 'isActive'> & {
  getIsActive?: (editor: Editor) => boolean
}

export type ToolbarComponent = InnerToolbarBtnProps & HasEditorProps

export type ToolbarItemProps = ToolbarBtnProps & {
  Component?: FC<ToolbarComponent>
}

const renderHeader = (level?: '1' | '2' | '3') => (
  <div className='font-weight-bold'>{`H${level || ''}`}</div>
)

export const toolbarItemsProps: ToolbarItemProps[] = [
  {
    name: 'Bold',
    onCommand: (c) => c.toggleBold(),
    icon: <SubIcon Icon={FaBold} />,
    getIsActive: (e) => e.isActive('bold'),
  },
  {
    name: 'Italic',
    onCommand: (c) => c.toggleItalic(),
    icon: <SubIcon Icon={FaItalic} />,
    getIsActive: (e) => e.isActive('italic'),
  },
  {
    name: 'H',
    onCommand: (c) => c.toggleHeading({ level: 2 }),
    icon: renderHeader(),
    getIsActive: (e) => e.isActive('heading', { level: 2 }),
  },
  // {
  //   name: 'Highlight',
  //   onCommand: c => c.toggleHighlight(),
  //   icon: <SubIcon Icon={FaHighlighter} />,
  //   getIsActive: e => e.isActive('highlight')
  // },
  // {
  //   name: 'Code',
  //   onCommand: c => c.toggleCode(),
  //   icon: <SubIcon Icon={GoCode} />,
  //   getIsActive: e => e.isActive('code')
  // },
  // {
  //   name: 'H3',
  //   onCommand: c => c.toggleHeading({ level: 3 }),
  //   icon: renderHeader('3'),
  //   getIsActive: e => e.isActive('heading', { level: 3 })
  // },

  {
    name: 'Bullet list',
    onCommand: (c) => c.toggleBulletList(),
    icon: <SubIcon Icon={FaListUl} />,
    getIsActive: (e) => e.isActive('bulletList'),
  },
  // {
  //   name: 'Ordered list',
  //   onCommand: c => c.toggleOrderedList(),
  //   icon: <SubIcon Icon={FaListOl} />,
  //   getIsActive: e => e.isActive('orderedList')
  // },
  {
    name: 'Code block',
    onCommand: (c) => c.toggleCodeBlock(),
    icon: <SubIcon Icon={BiCodeCurly} />,
    getIsActive: (e) => e.isActive('codeBlock'),
  },
  {
    name: 'Blockquote',
    onCommand: (c) => c.toggleBlockquote(),
    icon: <SubIcon Icon={FaQuoteLeft} />,
    getIsActive: (e) => e.isActive('blockquote'),
  },
  {
    name: 'Horizontal rule',
    onCommand: (c) => c.setHorizontalRule(),
    icon: <SubIcon Icon={GoHorizontalRule} />,
  },
  // {
  //   name: 'Insert Embed',
  //   icon: <SubIcon Icon={ImEmbed2} />,
  //   Component: CreateEmbedModal,
  // },
  {
    name: 'Insert link',
    icon: <SubIcon Icon={FaLink} />,
    Component: CreateLinkModal,
    getIsActive: (e) => e.isActive('link'),
  },
  {
    name: 'Insert image',
    icon: <SubIcon Icon={FaImage} />,
    Component: UploadImageModal,
  },
  // {
  //   name: 'Hard break',
  //   onCommand: c => c.setHardBreak(),
  //   icon: <SubIcon Icon={ImPagebreak} />
  // },
  // {
  //   name: 'Clear format',
  //   onCommand: c => c.unsetAllMarks(),
  //   icon: <SubIcon Icon={ImClearFormatting} />
  // }
]
