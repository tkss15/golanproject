"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Search } from "lucide-react"
import useDebounce from "@/hooks/useDebounce"
import { Input } from '@/components/ui/input'
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock function to simulate API call for suggestions
const fetchSuggestions = async (query: string, offset = 0): Promise<{ suggestions: any[], hasMore: boolean }> => {
    if (!query || !query.trim()) return { suggestions: [], hasMore: false };
    
    try {
        const response = await fetch(`/api/projects/autocomplete?q=${encodeURIComponent(query.trim())}&offset=${offset}`)
        if (!response.ok) throw new Error('Network response was not ok')
        
        return await response.json()
    } catch (error) {
        console.error('Autocomplete fetch error:', error)
        return { suggestions: [], hasMore: false }
    }
}

export default function ProjectAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const debouncedQuery = useDebounce(query, 1000)
  
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery) {
          if(query.length <= 1)
              return;
        setIsLoading(true)
        const { suggestions: results, hasMore: more } = await fetchSuggestions(debouncedQuery)
        setSuggestions(results)
        setHasMore(more)
        setOffset(4) // התחלת האופסט הבא
        setIsLoading(false)
      } else {
        setSuggestions([])
        setHasMore(false)
        setOffset(0)
      }
    }
    
    fetchData()
  }, [debouncedQuery])

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true)
    const { suggestions: newResults, hasMore: more } = await fetchSuggestions(query, offset)
    setSuggestions(prev => [...prev, ...newResults])
    setHasMore(more)
    setOffset(prev => prev + 4)
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === "Enter" && selectedIndex > -1) {
      setQuery(suggestions[selectedIndex].name)
      setSuggestions([])
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <div className='relative mb-4'>
        <Input 
          ref={inputRef}
          type="text" 
          placeholder="חיפוש פרויקטים" 
          className='pl-10 text-right'
          value={query}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
      </div>
      {suggestions.length > 0 && (
        <ul className="mt-0.5 bg-white border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.id}
              href={`/projects/${suggestion.id}`}
              className={`
                flex items-center gap-2 px-4 py-2 text-right hover:bg-gray-100 transition-colors
                ${index === selectedIndex ? 'bg-blue-50' : ''}
                ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}
              `}
            >
              <Search className="h-4 w-4 text-gray-400" />
              <span className="flex-grow">{suggestion.name}</span>
              <Badge>{suggestion.department} {suggestion.department_type}</Badge>
            </Link>
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 text-center"
              disabled={isLoading}
            >
              {isLoading ? 'טוען...' : 'טען עוד'}
            </button>
          )}
        </ul>
      )}
    </div>
  )
}

