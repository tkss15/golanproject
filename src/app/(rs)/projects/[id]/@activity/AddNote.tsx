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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Plus } from "lucide-react"
import { useToast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export function AddNote({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async () => {
    if (!text.trim()) return
    if(projectId)
    {
      console.log(projectId)
    }
    setIsSubmitting(true)
    
    try {
      // Call the API to add the note
      const response = await fetch(`/api/projects/${projectId}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add note');
      }
      
      toast.success("הערה נוספה", "ההערה התווספה ליומן הפעילויות", 3000)
      setText("")
      setTags([])
      setOpen(false)
      
      // Refresh the page to show the new note
      router.refresh()
    } catch (error) {
      console.error("Error adding note:", error)
      toast.error("שגיאה בהוספת הערה", error instanceof Error ? error.message : "שגיאה לא ידועה", 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <MessageSquare className="h-4 w-4" />
          הוסף הערה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">הוספת הערה ליומן פעילויות</DialogTitle>
          <DialogDescription className="text-right">
            הוסף הערה או מידע חופשי שיישמר ביומן הפעילויות של הפרויקט.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="note"
              className="resize-none h-32"
              placeholder="הזן את הטקסט כאן..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              dir="rtl"
            />
          </div>
          <div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!text.trim() || isSubmitting}
          >
            {isSubmitting ? "שומר..." : "שמור הערה"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
