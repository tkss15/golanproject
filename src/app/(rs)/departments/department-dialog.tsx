"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Match the interface with your table structure
interface Department {
  id?: string
  department_name: string
  project_type: string
  project_count?: number
}

interface AddDepartmentDialogProps {
  initialData?: Department | null
  onSubmit: (data: Department) => Promise<void>
  onClose: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddDepartmentDialog({
  initialData,
  onSubmit,
  onClose,
  open,
  onOpenChange
}: AddDepartmentDialogProps) {
  const [formData, setFormData] = useState<Department>(() => ({
    department_name: initialData?.department_name ?? "",
    project_type: initialData?.project_type ?? "",
  }))

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDialogClose = () => {
    setFormData({
      department_name: "",
      project_type: "",
    })
    onClose()
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">
            {initialData ? "ערוך מחלקה" : "הוסף מחלקה חדשה"}
          </DialogTitle>
          <DialogDescription className="text-right">
            הזן את פרטי המחלקה כאן. לחץ על שמור כשתסיים.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="department_name">שם מחלקה</Label>
            <Input
              id="department_name"
              name="department_name"
              value={formData.department_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project_type">סוג פרויקט</Label>
            <Input
              id="project_type"
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDialogClose}
            disabled={isSubmitting}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "שומר..." : "שמור שינויים"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )

  // Controlled dialog when used as an edit dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    )
  }

  // Uncontrolled dialog with trigger for adding new items
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          הוסף מחלקה
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}