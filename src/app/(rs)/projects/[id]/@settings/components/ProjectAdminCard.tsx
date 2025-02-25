'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteProjectDialog } from "./delete-dialog"

export function ProjectAdminCard({
    project_name,
    project_id,
}: {
    project_name: string,
    project_id: number,
}) {

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">פעולות אדמיניסטרטיביות</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">מחיקת פרוייקט תוביל למחיקת כל הקשרים הקשורים לפרויקט.</p>
          <DeleteProjectDialog 
            project_id={project_id}
            project_name={project_name}
          />
      </CardContent>
    </Card>
  )
} 