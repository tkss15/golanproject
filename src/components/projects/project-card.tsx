import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MoreVertical, Briefcase, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  project_name: string
  description: string
  budget: string
  startDate: string
  endDate: string
  status: string
  department: string
  progress: number
  owner: string
}

export function ProjectCard({ project_name, department, status, progress, budget, startDate, endDate, owner }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'בביצוע':
        return 'bg-green-100 text-green-800'
      case 'בתכנון':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{project_name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
            <DropdownMenuItem>ערוך פרויקט</DropdownMenuItem>
            <DropdownMenuItem>הצג פרטים</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">מחק פרויקט</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="flex items-center">
            <Briefcase className="ml-1 h-3 w-3" />
            {department}
          </Badge>
          <Badge className={`${getStatusColor(status)}`}>{status}</Badge>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-600 mb-2">תקציב: {budget}</p>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="ml-1 h-3 w-3" />
          <span>{startDate} - {endDate}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <img src="/placeholder.svg" alt={owner} className="w-8 h-8 rounded-full" />
          <span className="text-sm text-gray-600">{owner}</span>
        </div>
      </CardContent>
    </Card>
  )
}

