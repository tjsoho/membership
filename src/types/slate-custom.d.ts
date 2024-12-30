import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

export type CustomElementType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "numbered-list"
  | "bulleted-list"
  | "list-item"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-justify"

export type CustomFormatType = "bold" | "italic" | "underline" | "strikethrough"

export interface CustomText {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  fontSize?: string
  fontFamily?: string
  color?: string
  backgroundColor?: string
}

export interface CustomElement {
  type: CustomElementType
  align?: string
  children: CustomText[]
} 