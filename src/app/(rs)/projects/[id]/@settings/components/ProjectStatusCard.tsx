'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/useToast"
import { redirect } from "next/navigation"
export function ProjectStatusCard({ projectId, onUpdate }: { 
  projectId: number,
  onUpdate: (status: string, reason?: string) => Promise<void> 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onUpdate(status, status !== "1" ? reason : undefined)
      toast.success('סטטוס פרויקט עודכן בהצלחה',`סטטוס הפרוייקט שונה ל${status === "1" ? "פעיל" : status === "2" ? "בתכנון" : status === "3" ? "מעוכב" : "סגור"}${reason ? " עם הסבר" : ""}`, 3000);
    } catch (error) {
      if(error instanceof Error) {
        toast.error('שגיאה בשמירת סטטוס פרויקט', error.message, 3000);
      }
      else {
        toast.error('שגיאה בשמירת סטטוס פרויקט', 'שגיאה בשמירת סטטוס פרויקט', 3000);
      }
    } finally {
      setIsLoading(false)
    }
    redirect(`/projects/${projectId}`)
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">סטטוס פרויקט</CardTitle>
        <CardDescription>בחר סטטוס פרויקט כפי שהוא יוצג לכל המשתתפים בפרויקט.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
      <Select 
            dir="rtl" 
            value={status}
            onValueChange={(value) => setStatus(value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="בחר סטטוס" />
            </SelectTrigger>
            <SelectContent data-side="right">
              <SelectItem value="1">פעיל</SelectItem>
              <SelectItem value="2">בתכנון</SelectItem>
              <SelectItem value="3">מעוכב</SelectItem>
              <SelectItem value="4">סגור</SelectItem>
            </SelectContent>
          </Select>
          
          {status && status !== "1" && (
            <div className="mt-4">
              <Textarea
                dir="rtl"
                placeholder="הסבר על שינוי הסטטוס"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                className="resize-none"
                rows={3}
              />
            </div>
          )}
      </CardContent>
      <CardFooter className="border-t pt-2">
        <Button 
          size="sm" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'שומר...' : 'שמירה'}
        </Button>
      </CardFooter>
    </Card>
  )
} 