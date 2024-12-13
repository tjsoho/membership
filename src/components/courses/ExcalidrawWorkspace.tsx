'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import debounce from 'lodash/debounce'

export interface ExcalidrawElement {
  type: string
  version: number
  versionNonce: number
  isDeleted: boolean
  id: string
  fillStyle: string
  strokeWidth: number
  strokeStyle: string
  roughness: number
  opacity: number
  angle: number
  x: number
  y: number
  strokeColor: string
  backgroundColor: string
  width: number
  height: number
  seed: number
  groupIds: string[]
  frameId: null | string
  roundness: null | { type: number; value: number }
  boundElements: null | { type: string; id: string }[]
  updated: number
  link: null | string
  locked: boolean
}

export interface ExcalidrawContent {
  elements: ExcalidrawElement[]
  appState: {
    viewBackgroundColor: string
    currentItemFontFamily: number
    zoom: { value: number }
    scrollX: number
    scrollY: number
  }
}

interface ExcalidrawWorkspaceProps {
  content?: ExcalidrawContent
  onSave?: (content: ExcalidrawContent) => void
  isEditing?: boolean
  setTmpAppState?:any
  setTmpElement?:any
}

export function ExcalidrawWorkspace({ content, onSave, isEditing,setTmpAppState,setTmpElement }: ExcalidrawWorkspaceProps) {
  const excalidrawRef = useRef<any>(null)
  const [lastSavedData, setLastSavedData] = useState<ExcalidrawContent | null>(null)

  // Load initial content
  useEffect(() => {
    if (content && excalidrawRef.current) {
      console.log('Loading content into Excalidraw:', content)
      try {
        excalidrawRef.current.updateScene({
          elements: content.elements || [],
          appState: {
            ...content.appState,
            viewBackgroundColor: content.appState?.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: content.appState?.currentItemFontFamily || 1,
          }
        })
      } catch (error) {
        console.error('Error loading content:', error)
      }
    }
  }, [content])

  const debouncedSave = useCallback(
    debounce((elements: ExcalidrawElement[], appState: any) => {
      setTmpElement(elements)
      setTmpAppState(appState)
      if (!onSave || !isEditing || !elements) return
      
      // Only save if there are elements or if we're explicitly saving
      if (elements.length > 0) {
        const saveContent: ExcalidrawContent = {
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: appState.currentItemFontFamily || 1,
            zoom: appState.zoom || { value: 1 },
            scrollX: appState.scrollX || 0,
            scrollY: appState.scrollY || 0,
          }
        }
        
        // Only save if content has changed
        if (JSON.stringify(saveContent) !== JSON.stringify(lastSavedData)) {
          console.log('Saving new content:', saveContent)
          onSave(saveContent)
          setLastSavedData(saveContent)
        }
      }
    }, 1000),
    [onSave, isEditing, lastSavedData]
  )

  return (
    <div className="w-full h-full">
      <Excalidraw
        ref={excalidrawRef}
        initialData={{
          elements: content?.elements || [],
          appState: {
            viewBackgroundColor: content?.appState?.viewBackgroundColor || '#ffffff',
            currentItemFontFamily: content?.appState?.currentItemFontFamily || 1,
            zoom: content?.appState?.zoom || { value: 1 },
            scrollX: content?.appState?.scrollX || 0,
            scrollY: content?.appState?.scrollY || 0,
          }
        }}
        onChange={(elements: ExcalidrawElement[], appState: any) => {
          // Only trigger save if we have elements
          if (elements && elements.length > 0) {
            debouncedSave(elements, appState)
          }
        }}
      />
    </div>
  )
}