'use client'
import OverviewLayout from "../OverviewLayout";
import { useProject } from "@/components/ProjectContext";
import { Button } from "@/components/ui/button";
import { Check, X, Pencil, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
export default function ProjectContent({project} : {project: any}) {
    const router = useRouter();
    const {editMode, setEditMode, editing} = useProject();
    const [description, setDescription] = useState(project.description);
    const toast = useToast();
    const handleCancelProjectEdit = () => {
        setEditMode(null);
    }
    const handleProjectEdit = async () => {
        try {
            await fetch(`/api/projects/${project.id}`, {
                method: 'PATCH',
                body: JSON.stringify({description: description})
            })
            setEditMode(null);
            toast.success('עודכן תיאור הפרויקט', 'עדכון הפרוייקט בוצע בהצלחה', 3000);
            router.refresh();
        } catch (error) {
            toast.error('שגיאה בעדכון תיאור הפרויקט', 'שגיאה בעדכון תיאור הפרויקט', 3000);
        }
    }
    const headerContent = (
        <div className="flex items-center gap-2 text-lg font-semibold mb-2">
        <Info className="w-5 h-5 text-primary" />
        תיאור הפרויקט
      </div>
    )
    const header = (
        <div className="flex justify-between w-full">
            <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                <Info className="w-5 h-5 text-primary" />
                תיאור הפרויקט
            </div>
            {editMode !== 'content' ?  
            <>
              <Button variant="ghost" onClick={() => setEditMode(prev => prev === 'content' ? null : 'content')}>
                <Pencil className="ml-2 h-2 w-2" />
              </Button>
            </> :(
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={handleCancelProjectEdit}>
                      <X className="ml-2 h-2 w-2" />
                  </Button>
                  <Button variant="ghost" onClick={handleProjectEdit}>
                    <Check className="ml-2 h-2 w-2" />
                  </Button>
                </div>
            )}
        </div>
    )
    return (
        <OverviewLayout header={editing ? header : headerContent}>
           {
            editMode === 'content' ? (
                <div className="flex flex-col gap-1 w-full justify-evenly">
                     <Textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Type your message here." />
                </div>
            ) : (
                <p>{project.description}</p>
            )
           }
        </OverviewLayout>
    )
}