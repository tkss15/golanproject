'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface PaginationContextType {
  tokenHistory: string[]
  currentIndex: number
  addToken: (token: string) => void
  getNextToken: () => string | null
  getPreviousToken: () => string | null
  getCurrentPosition: () => number
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined)

export function PaginationProvider({ children }: { children: React.ReactNode }) {
  const [tokenHistory, setTokenHistory] = useState<string[]>([''])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('tokenHistory')
    const savedIndex = localStorage.getItem('currentIndex')
    
    if (savedHistory && savedIndex) {
      setTokenHistory(JSON.parse(savedHistory))
      setCurrentIndex(Number(savedIndex))
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tokenHistory', JSON.stringify(tokenHistory))
    localStorage.setItem('currentIndex', String(currentIndex))
  }, [tokenHistory, currentIndex])

  const addToken = (token: string) => {
    setTokenHistory(prev => {
      // Remove any tokens after current index and add new token
      const newHistory = [...prev.slice(0, currentIndex + 1), token]
      return newHistory
    })
    setCurrentIndex(prev => prev + 1)
  }

  const getNextToken = () => {
    if (currentIndex < tokenHistory.length - 1) {
      setCurrentIndex(prev => prev + 1)
      return tokenHistory[currentIndex + 1]
    }
    return null
  }

  const getPreviousToken = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      return tokenHistory[currentIndex - 1]
    }
    return null
  }

  const getCurrentPosition = () => currentIndex

  return (
    <PaginationContext.Provider
      value={{
        tokenHistory,
        currentIndex,
        addToken,
        getNextToken,
        getPreviousToken,
        getCurrentPosition,
      }}
    >
      {children}
    </PaginationContext.Provider>
  )
}

export const usePagination = () => {
  const context = useContext(PaginationContext)
  if (context === undefined) {
    throw new Error('usePagination must be used within a PaginationProvider')
  }
  return context
}