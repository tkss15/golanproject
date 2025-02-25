'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/useToast"
export function ProjectBudgetCard({ initialBudget, onUpdate }: { 
  initialBudget: number, 
  onUpdate: (budget: number) => Promise<void> 
}) {
  const [budget, setBudget] = useState(initialBudget)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onUpdate(budget)
      toast.success('תקציב הפרויקט עודכן בהצלחה', 'תקציב הפרויקט עודכן בהצלחה', 3000);
    } catch (error) {
      if(error instanceof Error) {
        toast.error('שגיאה בשמירת תקציב הפרויקט', error.message, 3000);
      }
      else {
        toast.error('שגיאה בשמירת תקציב הפרויקט', 'שגיאה בשמירת תקציב הפרויקט', 3000);
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">תקציב הפרויקט</CardTitle>
        <CardDescription>תקציב הפרויקט יוצג לכל המשתתפים בפרויקט.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Input 
          type="number"
          value={budget} 
          onChange={(e) => setBudget(Number(e.target.value))}
          placeholder="תקציב הפרויקט" 
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