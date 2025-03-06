import { BareProps } from '@/utils/types'
import { PropsWithChildren } from 'react'
import { HasEditorProps, ToolbarBtn, toolbarItemsProps } from './components'

const StickyComponent = ({ children }: PropsWithChildren<{}>) => {
  return <div>{children}</div>
}

type ToolBarProps = BareProps &
  HasEditorProps & {
    sticky?: boolean
  }

export const ToolBar = ({ editor, className, sticky }: ToolBarProps) => {
  const toolbarItems = toolbarItemsProps.map(
    ({ Component = ToolbarBtn, getIsActive, ...props }) => {
      const isActive = !!getIsActive && !!editor && getIsActive(editor)

      return (
        <Component
          key={props.name}
          editor={editor}
          isActive={isActive}
          {...props}
        />
      )
    }
  )

  const toolbar = <div className={`DfToolbar ${className}`}>{toolbarItems}</div>

  return sticky ? <StickyComponent>{toolbar}</StickyComponent> : toolbar
}

export default ToolBar
