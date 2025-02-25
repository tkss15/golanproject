import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

type fundingSourceType = {
    id: number,
    department_name: string,
    project_type: string,
    project_count?: number
}

type Props = {
    department: fundingSourceType
    selectedDepartment: number
    handleItemSelection: (id: number) => void
}
export default function DepartmentItem({department, selectedDepartment, handleItemSelection} : Props) {
    return (                                      
        <Link href={{
          pathname: '/projects',
          query: { department_id: department.id },
        }}
        >
      <Card 
        className={`
          mt-2 transition-all duration-300 
          ${selectedDepartment === department.id 
            ? 'border-primary-500 bg-blue-50 scale-105' 
            : 'hover:bg-gray-100 hover:shadow-md'}
            `} 
            >
        <CardHeader>
          <CardTitle className='text-lg'>{department.department_name}{department.project_type ? (' - ' + department.project_type) : ''}</CardTitle>
          <CardDescription>
            {department.project_count} פרויקטים פעילים
          </CardDescription>
        </CardHeader>
      </Card>
    </Link> 
  )
}
