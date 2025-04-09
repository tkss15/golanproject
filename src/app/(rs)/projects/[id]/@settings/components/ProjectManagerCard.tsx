'use client'

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProjectManagerPopup } from "./project-manager-popup"
import { Check, UserCog } from "lucide-react"
import { useToast } from "@/hooks/useToast"

export function ProjectManagerCard({
  projectManagers,
  currentManagerId,
  onUpdate,
}: {
  projectManagers: { id: number, full_name: string, company_name: string }[]
  currentManagerId?: number
  onUpdate: (managerId: number) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const toast = useToast()
  const [selectedManagerId, setSelectedManagerId] = useState<number | undefined>(currentManagerId)

  const currentManager = projectManagers.find(m => m.id === currentManagerId)

  const handleUpdate = () => {
    if (!selectedManagerId) {
      toast.error("שגיאה", "אנא בחר מנהל פרויקט")
      return
    }

    if (selectedManagerId === currentManagerId) {
      toast.info("מידע","לא בוצע שינוי במנהל הפרויקט")
      return
    }

    startTransition(async () => {
      try {
        await onUpdate(selectedManagerId)
        toast.success("מנהל פרוייקט חדש","מנהל הפרויקט עודכן בהצלחה")
      } catch (error) {
        toast.error("שגיאה בעדכון מנהל","שגיאה בעדכון מנהל הפרויקט")
        console.error("Error updating project manager:", error)
      }
    })
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          מנהל פרויקט חיצוני
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500">
            {currentManager ? (
              <div>
                מנהל הפרויקט הנוכחי: <span className="font-medium">{currentManager.full_name}</span>
                {currentManager.company_name && (
                  <span className="text-gray-500"> ({currentManager.company_name})</span>
                )}
              </div>
            ) : (
              "לא נבחר מנהל פרויקט חיצוני"
            )}
          </div>
          
          <div className="flex gap-2 items-center">
            <ProjectManagerPopup 
              managers={projectManagers} 
              value={selectedManagerId?.toString() ?? ""} 
              onChange={(value) => setSelectedManagerId(Number(value))}
            />
            
            <Button
              onClick={handleUpdate}
              disabled={isPending || selectedManagerId === currentManagerId}
              variant="default"
              size="sm"
              className="gap-1"
            >
              {isPending ? "מעדכן..." : "עדכן"} 
              {!isPending && <Check className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
