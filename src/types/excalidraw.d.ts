declare module '@excalidraw/excalidraw' {
  const Excalidraw: React.FC<any>
  export { Excalidraw }
  export function exportToBlob(opts: {
    elements: any[]
    mimeType?: string
    appState?: Record<string, any>
    files?: any
    getDimensions?: (width: number, height: number) => { width: number; height: number }
  }): Promise<Blob>
} 