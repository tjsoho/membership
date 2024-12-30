declare module 'slate-history' {
  import { Editor } from 'slate'
  
  export interface HistoryEditor extends Editor {
    undo: () => void
    redo: () => void
    history: {
      undos: any[]
      redos: any[]
    }
  }

  export function withHistory<T extends Editor>(editor: T): T & HistoryEditor
} 