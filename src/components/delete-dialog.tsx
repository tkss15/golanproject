"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DeleteUserDialogProps {
  userName: string
  userEmail: string
  onDelete: () => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteUserDialog({ userName, userEmail, onDelete, open, onOpenChange }: DeleteUserDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!isConfirmed) return
    setIsDeleting(true)
    try {
      await onDelete()
      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setIsDeleting(false)
      setIsConfirmed(false)
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[440px]">
      <DialogHeader>
        <DialogTitle className="text-right">מחיקת משתמש</DialogTitle>
        <DialogDescription className="text-base text-right">
          אתה עומד למחוק משתמש בשם <b>{userName}</b> ({userEmail}). כל פרטי המשתמש וכל פעילות עתידית תימחק בצורה זמינה.
          המשתמש לא יוכל להתחבר יותר ולא יוכל לגשת לכל פרטי המשתמש או פעילות עתידית.<br></br>
          כל הפרוייקטים והקבצים שהמשתמש פתח יועברו למשתמש זה 
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="flex items-center space-x-2 text-right">
          <Checkbox
            className="ml-2"
            id="confirm"
            checked={isConfirmed}
            onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
          />
          <Label htmlFor="confirm">כן, אני בטוח שאני רוצה למחוק</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isDeleting}>
          ביטול
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={!isConfirmed || isDeleting}>
          {isDeleting ? "מחיקה..." : "מחיקת משתמש"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  )
}

