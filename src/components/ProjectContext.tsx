'use client'
import { createContext, useContext, useState, useEffect } from 'react'

interface ProjectContextType {
    editing: boolean
    setEditing: (editing: boolean) => void
    editMode: "milestones" | "content" | "project" | "team" | "budget" | "documents" | "settings" | "contact" | null
    setEditMode: (editMode: "milestones" | "content" | "project" | "team" | "budget" | "documents" | "settings" | "contact" | null) => void
}
const ProjectContext = createContext<ProjectContextType | undefined>(undefined)



export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState<"milestones" | "content" | "project" | "team" | "budget" | "documents" | "settings" | "contact" | null>(null)
  const [editing, setEditing] = useState(false)
  useEffect(() => {
    console.log(editMode)   
  }, [editMode])
  return (
    <ProjectContext.Provider
      value={{
        editMode,
        setEditMode,
        editing,
        setEditing
      }}
    >
      {children}

    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}