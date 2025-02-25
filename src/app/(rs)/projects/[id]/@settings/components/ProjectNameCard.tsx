'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/useToast"

export function ProjectNameCard({ initialName, onUpdate }: { 
  initialName: string, 
  onUpdate: (name: string) => Promise<void> 
}) {
  const [name, setName] = useState(initialName)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onUpdate(name)
      toast.success('שם הפרויקט עודכן בהצלחה', 'שם הפרויקט עודכן בהצלחה', 3000);
    } catch (error) {
      if(error instanceof Error) {
        toast.error('שגיאה בשמירת שם הפרויקט', error.message, 3000);
      }
      else {
        toast.error('שגיאה בשמירת שם הפרויקט', 'שגיאה בשמירת שם הפרויקט', 3000);
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">שם הפרויקט</CardTitle>
        <CardDescription>שם הפרויקט יוצג לכל המשתתפים בפרויקט.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="שם הפרויקט" 
        />
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