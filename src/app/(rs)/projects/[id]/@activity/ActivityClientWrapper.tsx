"use client"

import { useState, useEffect } from "react"
import { ActivityLog } from "./actrivity-log"

export function ActivityClientWrapper({ 
  initialLogs, 
  projectId 
}: { 
  initialLogs: any[], 
  projectId: string 
}) {
  const [logs, setLogs] = useState(initialLogs)
  const [isLoading, setIsLoading] = useState(false)

  // Function to fetch fresh logs
  const fetchLogs = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/logs`)
      if (!response.ok) {
        throw new Error("Failed to fetch logs")
      }
      
      const freshLogs = await response.json()
      setLogs(freshLogs)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Set up effect to detect when this component is in the active tab
  useEffect(() => {
    // Function to check if activity tab is currently visible
    const checkTabVisibility = () => {
      // Find if any activity tab content is currently active
      const activityTabContent = document.querySelector('[value="activity"].max-h-\\[45rem\\]:not([hidden])')
      
      if (activityTabContent) {
        fetchLogs()
      }
    }

    // Create MutationObserver to watch for tab changes
    const observer = new MutationObserver(() => {
      checkTabVisibility();
    })

    // Find tab triggers and tab contents to observe
    const tabsList = document.querySelector('[role="tablist"]')
    const tabsContent = document.querySelector('[value="activity"].max-h-\\[45rem\\]')
    
    if (tabsList) {
      // Watch for click events that might indicate tab changes
      tabsList.addEventListener('click', () => {
        // Small delay to let the UI update first
        setTimeout(checkTabVisibility, 100)
      })
    }
    
    if (tabsContent) {
      // Watch for visibility changes on the activity tab content
      observer.observe(tabsContent, { attributes: true, attributeFilter: ['hidden'] })
    }

    // Initial check in case we're already on the activity tab
    setTimeout(checkTabVisibility, 100)

    return () => {
      observer.disconnect()
      if (tabsList) {
        tabsList.removeEventListener('click', () => {
          setTimeout(checkTabVisibility, 100)
        })
      }
    }
  }, [projectId])

  return <ActivityLog logs={logs} project_id={projectId} />
}
