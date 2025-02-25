"use client"

import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteLoader } from "./delete-loader"

interface DeleteProjectDialogProps {
  project_name: string
  project_id: number
}

export function DeleteProjectDialog({ project_name, project_id }: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/projects/${project_id}`, {
        method: 'DELETE',
        })
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      setOpen(false)
      setIsDeleting(false)
    } catch (error) {
      console.error('Failed to delete project:', error)
    } finally {
        setOpen(false)
        setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          מחק פרויקט
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isDeleting && <DeleteLoader />}
        {!isDeleting && (
            <>  
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                מחק פרויקט {project_name}
            </DialogTitle>
            <DialogDescription className="text-base">
                הפרוייקט שלך יימחק בפועל ולא יהיה ניתן לשחזר.
            </DialogDescription>
            </DialogHeader>
            <div className="py-4">
            <p className="text-sm text-muted-foreground">
                הפעולה לא תכולה להתבצע שוב.
            </p>
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
                ביטול
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
                מחק פרויקט
            </Button>
            </DialogFooter>
            </>)}
      </DialogContent>
    </Dialog>
  )
}

