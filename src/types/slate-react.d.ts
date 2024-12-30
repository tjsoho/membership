declare module 'slate-react' {
  import { ReactNode } from 'react'
  import { Editor, BaseEditor, Range, Point } from 'slate'

  export interface ReactEditor extends BaseEditor {
    insertData: (data: DataTransfer) => void
    setFragmentData: (data: DataTransfer) => void
    hasRange: (editor: ReactEditor, range: Range) => boolean
  }

  export interface RenderElementProps {
    children: ReactNode
    element: any
    attributes: {
      'data-slate-node': 'element'
      'data-slate-inline'?: true
      'data-slate-void'?: true
      dir?: 'rtl'
      ref: any
    }
  }

  export interface RenderLeafProps {
    children: ReactNode
    leaf: any
    text: any
    attributes: {
      'data-slate-leaf': true
    }
  }

  export const Slate: React.FC<{
    editor: ReactEditor
    value: any[]
    children: ReactNode
    onChange?: (value: any[]) => void
  }>

  export const Editable: React.FC<{
    renderElement?: (props: RenderElementProps) => JSX.Element
    renderLeaf?: (props: RenderLeafProps) => JSX.Element
    placeholder?: string
    [key: string]: any
  }>

  export const useSlate: () => ReactEditor
  export const withReact: <T extends BaseEditor>(editor: T) => T & ReactEditor
} 