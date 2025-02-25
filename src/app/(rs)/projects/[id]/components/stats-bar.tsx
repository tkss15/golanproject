// import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
// import { Calendar, Briefcase, User } from 'lucide-react'
// import { format } from 'date-fns'
// import type { getProjectProp } from '@/lib/queries/projects/getProject'
// type Props = {
//   project: getProjectProp
// }
// /**
//  * Formats a number as currency with specified options
//  * @param {number} amount - The amount to format
//  * @param {string} [currency='USD'] - Currency code
//  * @param {string} [locale='en-US'] - Locale for formatting
//  * @returns {string} Formatted currency string
//  */

// export function StatsBar({project}: Props) {
//   const budgetCurrency = formatCurrency(project.budget)
//   const startDate = format(new Date(project.start_date), 'dd/MM/yyyy')
//   const EndDate = (project.end_date  && format(new Date(project.end_date), 'dd/MM/yyyy') )
//   return (
//     <div className="bg-white rounded-lg shadow p-6 flex flex-wrap justify-between items-center gap-4">
//       <Badge className="bg-green-100 text-green-800">בביצוע</Badge>
//       <div className="flex items-center">
//         <span className="text-sm text-gray-600 ml-2">תקציב:</span>
//         <Progress value={75} className="w-24 ml-2" />
//         <span className="text-sm font-medium">{budgetCurrency}</span>
//       </div>
//       <div className="flex items-center">
//         <Calendar className="h-4 w-4 text-gray-400 ml-2" />
//         <span className="text-sm">{startDate} {EndDate ? `- ${EndDate}` : ''}</span>
//       </div>
//       <div className="flex items-center">
//         <Briefcase className="h-4 w-4 text-gray-400 ml-2" />
//         <span className="text-sm">{project.department_name}</span>
//       </div>
//       <div className="flex items-center">
//         <User className="h-4 w-4 text-gray-400 ml-2" />
//         {/* <img src="/placeholder.svg" alt="Project Owner" className="w-6 h-6 rounded-full ml-2" /> */}
//         <span className="text-sm">{project.owner_last_name} {project.owner_first_name}</span>
//       </div>
//     </div>
//   )
// }

