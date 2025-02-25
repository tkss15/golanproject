'use client'
import { useProject } from "@/components/ProjectContext"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
export function EditButton() {
    const { editing, setEditing } = useProject()
    const handleEdit = () => {
        setEditing(!editing)

    }   
    return (<Button  className="w-full justify-start" onClick={handleEdit}>
        <Edit className="ml-2 h-4 w-4" />
        {editing ? "סגור" : "מצב עריכה"}
    </Button>)
}

export function EditButtonMobile({ hanldeClose }: { hanldeClose: () => void }) {
    const { editing, setEditing } = useProject()
    const handleEdit = () => {
        setEditing(!editing)
        hanldeClose()
    }   
    return (
    <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
        <Edit className="ml-2 h-4 w-4" />
        {editing ? "סגור" : "מצב עריכה"}
    </Button>
    )
}
