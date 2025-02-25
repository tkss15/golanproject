import { Button } from '@/components/ui/button'
import { ArrowRight, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { getProjectProp } from '@/lib/queries/projects/getProject'
import { useProject } from '@/components/ProjectContext'
type Props = {
  project: getProjectProp
}

export function Header({project} : Props) {
  const { editMode } = useProject()
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <Link href="/projects" className="flex items-center text-blue-600 hover:text-blue-800 mb-2 sm:mb-0">
          <ArrowRight className="ml-2 h-4 w-4" />
          חזרה לפרויקטים
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{project.project_name}</h1>
      </div>
      <div className="flex mt-4 sm:mt-0">
        <Button variant="outline" className="ml-2">
          <Edit className="ml-2 h-4 w-4" />
          ערוך
        </Button>
        <Button variant="destructive">
          <Trash2 className="ml-2 h-4 w-4" />
          מחק
        </Button>
      </div>
    </header>
  )
}

