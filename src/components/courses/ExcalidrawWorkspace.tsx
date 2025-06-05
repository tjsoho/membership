'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { AppState } from '@excalidraw/excalidraw/types/types'
import type { BinaryFiles } from '@excalidraw/excalidraw/types/types'
import debounce from 'lodash/debounce'

export type { ExcalidrawElement }

export interface ExcalidrawContent {
  elements: readonly ExcalidrawElement[]
  appState: AppState
}

interface ExcalidrawWorkspaceProps {
  content?: ExcalidrawContent
  onSave?: (content: ExcalidrawContent) => void
  isEditing?: boolean
  setTmpAppState?: (state: AppState) => void
  setTmpElement?: (elements: readonly ExcalidrawElement[]) => void
}

export function ExcalidrawWorkspace({ content, onSave, isEditing, setTmpAppState, setTmpElement }: ExcalidrawWorkspaceProps) {
  const [lastSavedData, setLastSavedData] = useState<ExcalidrawContent | null>(null)
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false)

  // Load initial content
  useEffect(() => {
    if (content) {
      console.log('Loading content into Excalidraw:', content)
    }
  }, [content])

  const debouncedSave = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState) => {
      setTmpElement?.(elements)
      setTmpAppState?.(appState)
      if (!onSave || !isEditing || !elements) return

      if (elements.length > 0) {
        const saveContent: ExcalidrawContent = {
          elements,
          appState
        }

        if (JSON.stringify(saveContent) !== JSON.stringify(lastSavedData)) {
          console.log('Saving new content:', saveContent)
          onSave(saveContent)
          setLastSavedData(saveContent)
        }
      }
    },
    [onSave, isEditing, lastSavedData, setTmpElement, setTmpAppState]
  )

  // Add this useEffect for handling the Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isWorkspaceExpanded) {
        setIsWorkspaceExpanded(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isWorkspaceExpanded])

  return (
    <div className="w-full h-full relative">
      <div className={`
        w-full h-full transition-all duration-300
        ${isWorkspaceExpanded ? 'fixed inset-0 z-50 bg-white' : ''}
      `}>
        <Excalidraw
          initialData={{
            elements: content?.elements || [],
            appState: {
              viewBackgroundColor: content?.appState?.viewBackgroundColor || '#ffffff',
              currentItemFontFamily: content?.appState?.currentItemFontFamily || 1,
              zoom: content?.appState?.zoom || { value: 1 as any },
              scrollX: content?.appState?.scrollX || 0,
              scrollY: content?.appState?.scrollY || 0,
            }
          }}
          onChange={(elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
            if (elements && elements.length > 0) {
              debouncedSave(elements, appState)
            }
          }}
        />

        <button
          onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                     px-4 py-2 bg-coastal-dark-teal text-white rounded-lg 
                     hover:bg-coastal-light-teal transition-colors z-[9999]
                     shadow-lg"
        >
          {isWorkspaceExpanded ? "Make Smaller" : "Make Bigger"}
        </button>
      </div>
    </div>
  )
}