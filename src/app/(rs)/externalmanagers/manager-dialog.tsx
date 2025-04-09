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
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

// Match the interface with your table structure
interface ProjectManager {
    id?: string
    full_name: string
    company_name: string
    position: string
    email: string
    phone: string
    is_external: boolean
    is_active?: boolean
}

interface AddManagerDialogProps {
    initialData?: ProjectManager | null
    onSubmit: (data: ProjectManager) => Promise<void>
    onClose: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function AddManagerDialog({
    initialData,
    onSubmit,
    onClose,
    open,
    onOpenChange
}: AddManagerDialogProps) {
    const [formData, setFormData] = useState<ProjectManager>(() => ({
        full_name: initialData?.full_name ?? "",
        company_name: initialData?.company_name ?? "",
        position: initialData?.position ?? "",
        email: initialData?.email ?? "",
        phone: initialData?.phone ?? "",
        is_external: initialData?.is_external ?? true,
        is_active: initialData?.is_active ?? true
    }))

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
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
            full_name: "",
            company_name: "",
            position: "",
            email: "",
            phone: "",
            is_external: true,
            is_active: true
        })
        onClose()
    }

    const dialogContent = (
        <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
            <form onSubmit={handleSubmit}>
                <DialogHeader className="text-right">
                    <DialogTitle className="text-right">
                        {initialData ? "ערוך פרטי מנהל" : "הוסף מנהל פרויקט חדש"}
                    </DialogTitle>
                    <DialogDescription className="text-right">
                        הזן את פרטי מנהל הפרויקט כאן. לחץ על שמור כשתסיים.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="full_name">שם מלא</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="company_name">חברה</Label>
                        <Input
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="position">תפקיד</Label>
                        <Input
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">אימייל</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">טלפון</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                            id="is_external"
                            checked={formData.is_external}
                            onCheckedChange={(checked) => 
                                handleCheckboxChange("is_external", checked as boolean)
                            }
                        />
                        <Label htmlFor="is_external">מנהל חיצוני</Label>
                    </div>
                    {initialData && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => 
                                    handleCheckboxChange("is_active", checked as boolean)
                                }
                            />
                            <Label htmlFor="is_active">מנהל פעיל</Label>
                        </div>
                    )}
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
                    הוסף מנהל פרויקט
                </Button>
            </DialogTrigger>
            {dialogContent}
        </Dialog>
    )
}