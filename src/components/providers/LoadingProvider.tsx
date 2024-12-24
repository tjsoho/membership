/******************************************************************************
                                IMPORTS
******************************************************************************/
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'

/******************************************************************************
                                TYPES
******************************************************************************/
interface LoadingContextType {
  setIsLoading: (loading: boolean) => void
  showLoader: (message?: string) => void
  hideLoader: () => void
}

/******************************************************************************
                              CONTEXT
******************************************************************************/
const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

/******************************************************************************
                              COMPONENT
******************************************************************************/
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>()

  const showLoader = (msg?: string) => {
    setMessage(msg)
    setIsLoading(true)
  }

  const hideLoader = () => {
    setIsLoading(false)
    setMessage(undefined)
  }

/******************************************************************************
   *                            RENDER
******************************************************************************/
  return (
    <LoadingContext.Provider value={{ setIsLoading, showLoader, hideLoader }}>
      {children}
      {isLoading && <LoadingSpinner message={message} />}
    </LoadingContext.Provider>
  )
}

/******************************************************************************
                              HOOK
******************************************************************************/
export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 