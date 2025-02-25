'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/useToast"
export function ProjectStatusCard({ onUpdate }: { 
  onUpdate: (status: string) => Promise<void> 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onUpdate(status)
      toast.success('סטטוס פרויקט עודכן בהצלחה',`סטטוס הפרוייקט שונה ל${status === "1" ? "פעיל" : status === "2" ? "בתכנון" : status === "3" ? "מעוכב" : "סגור"}`, 3000);
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
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">סטטוס פרויקט</CardTitle>
        <CardDescription>בחר סטטוס פרויקט כפי שהוא יוצג לכל המשתתפים בפרויקט.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
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
              <SelectItem value="פעיל">פעיל</SelectItem>
              <SelectItem value="בתכנון">בתכנון</SelectItem>
              <SelectItem value="מעוכב">מעוכב</SelectItem>
              <SelectItem value="סגור">סגור</SelectItem>
            </SelectContent>
          </Select>      </CardContent>
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