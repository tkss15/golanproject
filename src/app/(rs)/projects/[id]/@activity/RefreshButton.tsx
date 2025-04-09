"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // This will refresh the entire server component
    router.refresh()
    
    // Reset state after a brief delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="ms-auto mb-4 flex items-center gap-1"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "מרענן..." : "רענן נתונים"}
    </Button>
  )
}
