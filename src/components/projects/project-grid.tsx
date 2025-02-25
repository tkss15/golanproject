import { ProjectCard } from './project-card'

const projects = [
  {
    name: 'פיתוח אפליקציה',
    department: 'הנדסה',
    status: 'בביצוע',
    progress: 75,
    budget: '₪100,000',
    startDate: '01/05/2023',
    endDate: '31/12/2023',
    owner: 'דן כהן'
  },
  {
    name: 'קמפיין שיווקי',
    department: 'שיווק',
    status: 'בתכנון',
    progress: 30,
    budget: '₪50,000',
    startDate: '01/07/2023',
    endDate: '30/09/2023',
    owner: 'רונה לוי'
  },
  {
    name: 'שדרוג תשתיות',
    department: 'תפעול',
    status: 'בביצוע',
    progress: 60,
    budget: '₪200,000',
    startDate: '01/03/2023',
    endDate: '31/08/2023',
    owner: 'אבי ישראלי'
  },
  {
    name: 'מחקר שוק',
    department: 'מחקר',
    status: 'בתכנון',
    progress: 15,
    budget: '₪75,000',
    startDate: '01/08/2023',
    endDate: '31/10/2023',
    owner: 'מיכל גולן'
  },
  {
    name: 'הדרכות עובדים',
    department: 'משאבי אנוש',
    status: 'בביצוע',
    progress: 45,
    budget: '₪30,000',
    startDate: '01/06/2023',
    endDate: '30/11/2023',
    owner: 'יעל שמיר'
  },
  {
    name: 'פיתוח מוצר חדש',
    department: 'מוצר',
    status: 'בתכנון',
    progress: 10,
    budget: '₪150,000',
    startDate: '01/09/2023',
    endDate: '30/04/2024',
    owner: 'עומר דוד'
  },
]

type Props = {
    '*': Omit<ProjectCardProps, 'owner'>
    ownerFirstName: string,
    ownerLastName: string
}
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

export function ProjectGrid({ projects } : {projects : Props[]}) {
    const restrcutreProjects:Array<ProjectCardProps> = projects.map((project) => {
        return {
            ...project['*'],
            progress: Math.random() * 100,
            owner: project.ownerFirstName + ' ' + project.ownerLastName
        }
    })
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {restrcutreProjects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  )
}

