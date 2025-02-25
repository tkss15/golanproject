import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
// import 'react-circular-progressbar/dist/styles.css'
import { FileText, MessageSquare, Share2 } from 'lucide-react'
import type { getProjectProp } from '@/lib/queries/projects/getProject'
import FileUploadDialog from "@/components/file-upload-dialog"
import { getMainSettlementInProject } from '@/lib/queries/getSettlementProjects'
import { ScrollArea } from '@/components/ui/scroll-area'
import {format, formatDistanceToNow} from 'date-fns'
import { getProjectLogs } from '@/lib/queries/logs/getProjectLogs'
import { he } from 'date-fns/locale/he'
import { ProjectLogInfiniteScroll } from './ProjectLogInfiniteScroll'
import { EditButton } from './EditButton'
import ExportFile from './exportFile'
import FastActions from './FastActions'
type Props = {
  project: getProjectProp
}

export async function Sidebar({project}: Props) {
  const progress = 75
  const settlementProject = await getMainSettlementInProject(project.id);
  if(!settlementProject)
    return <p>אנא הגדר לפרויקט ישוב ראשי.</p>
  const initialLogs = await getProjectLogs(project.id, 5, 0);
  return (
    <div className="w-full space-y-6">
      <Card className='hidden md:block'>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <EditButton />
          <FileUploadDialog project_id={project.id}/>
          <ExportFile project={project} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>התקדמות הפרויקט</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 min-h-40">
          <ScrollArea className="h-40 text-right">          
            {settlementProject.milestones.milestones.map((milestone, index) => (
              <div key={index} className="flex pr-3 justify-end items-center gap-1">
                  <div className="flex flex-col">
                    <div className="font-semibold">{milestone.title}</div>
                    <div className="text-sm text-gray-500">{format(milestone.due_date, 'dd/MM/yyyy')}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(milestone.status)}`} />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>פעולות אחרונות</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 min-h-40">
          <ProjectLogInfiniteScroll 
                initialLogs={initialLogs}
                projectId={project.id}
            />
        </CardContent>
      </Card>
    </div>
  )
}



function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-500"
    case "in-progress":
      return "bg-blue-500"
    default:
      return "bg-gray-300"
  }
}