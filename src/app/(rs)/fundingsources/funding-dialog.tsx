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
interface FundingSource {
  id?: string
  source_name: string
  source_type: string
  contact_details: string
}

interface AddFundingDialogProps {
  initialData?: FundingSource | null
  onSubmit: (data: FundingSource) => Promise<void>
  onClose: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddFundingDialog({ 
  initialData, 
  onSubmit, 
  onClose,
  open,
  onOpenChange
}: AddFundingDialogProps) {
  const [formData, setFormData] = useState<FundingSource>(() => ({
    source_name: initialData?.source_name ?? "",
    source_type: initialData?.source_type ?? "",
    contact_details: initialData?.contact_details ?? "",
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
      source_name: "",
      source_type: "",
      contact_details: "",
    })
    onClose()
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">
            {initialData ? "ערוך מקור מימון" : "הוסף מקור מימון חדש"}
          </DialogTitle>
          <DialogDescription className="text-right">
            הזן את פרטי מקור המימון כאן. לחץ על שמור כשתסיים.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="source_name">שם</Label>
            <Input 
              id="source_name"
              name="source_name"
              value={formData.source_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source_type">סוג מימון</Label>
            <Input 
              id="source_type"
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_details">פרטי קשר</Label>
            <Input 
              id="contact_details"
              name="contact_details"
              value={formData.contact_details}
              onChange={handleChange}
              
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
          הוסף מקור מימון
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}