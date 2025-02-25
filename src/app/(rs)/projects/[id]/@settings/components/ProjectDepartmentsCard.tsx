'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DepartmentsPopup } from "../depratments-popup"
import { useToast } from "@/hooks/useToast"
export function ProjectDepartmentsCard({ departments, currentDepartment, onUpdate }: { 
  departments: any[], 
  currentDepartment: string,
  onUpdate: (department_id: number) => Promise<void> 
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [department_id, setDepartmentId] = useState<number>(0)
  const toast = useToast();
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onUpdate(department_id)
      toast.success('מחלקה עודכנה בהצלחה',`המחלקה ${departments.find((department) => department.id === department_id)?.department_name} עודכנה בהצלחה`, 3000);
    } catch (error) {
      if(error instanceof Error) {
        toast.error('שגיאה בשמירת מחלקה', error.message, 3000);
      }
      else {
        toast.error('שגיאה בשמירת מחלקה', 'שגיאה בשמירת מחלקה', 3000);
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">מחלקות בפרויקט</CardTitle>
        <CardDescription>בחר מחלקות בפרויקט כפי שהוא יוצג לכל המשתתפים בפרויקט.</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <DepartmentsPopup currentDepartment={currentDepartment} onUpdate={setDepartmentId} departments={departments} />
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