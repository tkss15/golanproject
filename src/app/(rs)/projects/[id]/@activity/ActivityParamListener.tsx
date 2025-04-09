"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ActivityLog } from "./actrivity-log"

export function ActivityParamListener({ 
  initialLogs, 
  projectId 
}: { 
  initialLogs: any[], 
  projectId: string 
}) {
  const [logs, setLogs] = useState(initialLogs)
  const searchParams = useSearchParams()
  
  // This will re-run when any search parameters change
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/logs?_=${Date.now()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch logs")
        }
        
        const freshLogs = await response.json()
        setLogs(freshLogs)
      } catch (error) {
        console.error("Error fetching logs:", error)
      }
    }
    
    // Fetch new logs when search params change
    fetchLogs()
  }, [projectId, searchParams])

  return <ActivityLog logs={logs} />
}
