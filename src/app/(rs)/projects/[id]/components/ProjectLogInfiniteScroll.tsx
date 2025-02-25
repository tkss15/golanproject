'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { he } from 'date-fns/locale/he'
import { Loader2 } from 'lucide-react'

interface LogEntry {
  id: number
  project_id: number
  user_id: number
  action_type: string
  module: string
  description: string
  previous_state: any
  new_state: any
  metadata: any
  created_at: Date
  user_first_name: string
  user_last_name: string
}

interface ProjectLogInfiniteScrollProps {
  initialLogs: LogEntry[]
  projectId: number
}

export function ProjectLogInfiniteScroll({
  initialLogs,
  projectId,
}: ProjectLogInfiniteScrollProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMoreLogs = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/projects/${projectId}/logs?limit=5&offset=${(nextPage -1) * 5}`)
      const moreLogs = await response.json()
      
      if (moreLogs.length === 0) {
        setHasMore(false)
      } else {
        setLogs(prevLogs => [...prevLogs, ...moreLogs])
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Failed to load more logs', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <ScrollArea className="text-right h-[100px]">
        <ul className="space-y-2">
          {logs.length === 0 && (
            <li className="text-sm">אין פעילות אחרונה</li>
          )}
          {logs.map((log) => (
            <li key={log.id} className="text-sm">
              <span className="font-medium">{log.description}</span>
              <span className="block text-xs text-gray-500">
                לפני {formatDistanceToNow(new Date(log.created_at), { locale: he })} ע"י{' '}
                <span className="font-medium">
                  {log.user_first_name} {log.user_last_name}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
      
      {hasMore && (
        <div className="mt-2 text-center">
          <Button 
            onClick={loadMoreLogs} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                טוען...
              </>
            ) : (
              'טען עוד פעולות'
            )}
          </Button>
        </div>
      )}

      {!hasMore && logs.length > 0 && (
        <div className="text-center text-xs text-gray-500 mt-2">
          אין יותר פעולות
        </div>
      )}
    </div>
  )
}