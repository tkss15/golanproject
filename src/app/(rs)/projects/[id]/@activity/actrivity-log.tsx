"use client"

import { useState } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User } from "@/zod-schemas/users"

interface LogType  {
    log: ActivityLog
    user: User
}
interface ActivityLog {
  id: number
  project_id: number
  user_id: number
  action_type: string

  module: string
  description: string
  previous_state: any
  new_state: any
  created_at: string
  metadata: any
}

const activities: ActivityLog[] = [
  {
    id: 1,
    project_id: 123,
    user_id: 456,
    action_type: "עדכון_פרטים",
    module: "פרטי_פרויקט",
    description: "עדכון שם הפרויקט ותאריך סיום",
    previous_state: {
      project_name: "שיפוץ מתנ״ס",
      end_date: "2024-12-31",
    },
    new_state: {
      project_name: "שיפוץ והרחבת מתנ״ס",
      end_date: "2025-03-31",
    },
    created_at: "2024-01-29T10:30:00Z",
    metadata: {
      update_reason: "הרחבת היקף הפרויקט",
    },
  },
  {
    id: 2,
    project_id: 123,
    user_id: 456,
    action_type: "הוספת_ישוב",
    module: "ישובים",
    description: "הוספת ישוב חדש לפרויקט",
    previous_state: {
      settlements: ["כפר אדומים"],
    },
    new_state: {
      settlements: ["כפר אדומים", "מצפה יריחו"],
    },
    created_at: "2024-01-29T11:15:00Z",
    metadata: {
      settlement_id: 789,
      budget_allocation: 50000,
    },
  },
  {
    id: 3,
    project_id: 123,
    user_id: 456,
    action_type: "עדכון_תקציב",
    module: "תקציב",
    description: "הגדלת תקציב הפרויקט",
    previous_state: {
      budget: 1000000,
      funding_sources: [
        { id: 1, amount: 600000 },
        { id: 2, amount: 400000 },
      ],
    },
    new_state: {
      budget: 1500000,
      funding_sources: [
        { id: 1, amount: 800000 },
        { id: 2, amount: 700000 },
      ],
    },
    created_at: "2024-01-29T14:20:00Z",
    metadata: {
      approval_number: "2024-156",
      approved_by: "ועדת כספים",
    },
  },
  {
    id: 4,
    project_id: 123,
    user_id: 456,
    action_type: "העלאת_קובץ",
    module: "מסמכים",
    description: "העלאת תכנית עבודה מעודכנת",
    previous_state: null,
    new_state: {
      file_id: 321,
      file_name: "תכנית-עבודה-2024.pdf",
      file_size: 1024576,
    },
    created_at: "2024-01-29T15:45:00Z",
    metadata: {
      file_type: "application/pdf",
      category: "תכניות עבודה",
    },
  },
]

const actionTypeColors = {
  עדכון_פרטים: "bg-blue-500",
  הוספת_ישוב: "bg-green-500",
  עדכון_תקציב: "bg-yellow-500",
  העלאת_קובץ: "bg-purple-500",
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
  else return (bytes / 1073741824).toFixed(1) + " GB"
}

function ActivityDetails({ activity }: { activity: ActivityLog }) {
  switch (activity.action_type) {
    case "עדכון_פרטים":
      return (
        <div>
          <p>
            שם הפרויקט: {activity.previous_state.project_name} ➔ {activity.new_state.project_name}
          </p>
          <p>
            תאריך סיום: {activity.previous_state.end_date} ➔ {activity.new_state.end_date}
          </p>
          <p>סיבת העדכון: {activity.metadata.update_reason}</p>
        </div>
      )
    case "הוספת_ישוב":
      return (
        <div>
          <p>ישוב חדש: {activity.new_state.settlements[activity.new_state.settlements.length - 1]}</p>
          <p>מזהה ישוב: {activity.metadata.settlement_id}</p>
          <p>תקציב מוקצה: ₪{activity.metadata.budget_allocation.toLocaleString()}</p>
        </div>
      )
    case "עדכון_תקציב":
      return (
        <div>
          <p>תקציב קודם: ₪{activity.previous_state.budget.toLocaleString()}</p>
          <p>תקציב חדש: ₪{activity.new_state.budget.toLocaleString()}</p>
          <p>מספר אישור: {activity.metadata.approval_number}</p>
          <p>אושר על ידי: {activity.metadata.approved_by}</p>
        </div>
      )
    case "העלאת_קובץ":
      return (
        <div>
          <p>שם הקובץ: {activity.new_state.file_name}</p>
          <p>גודל הקובץ: {formatFileSize(activity.new_state.file_size)}</p>
          <p>סוג הקובץ: {activity.metadata.file_type}</p>
          <p>קטגוריה: {activity.metadata.category}</p>
        </div>
      )
    default:
      return <p>פרטים לא זמינים</p>
  }
}

export function ActivityLog({ logs }: { logs: LogType[] }) {
  const [displayedActivities, setDisplayedActivities] = useState(logs)
  console.log(logs);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-right">יומן פעילויות</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] overflow-y-auto">
          <ul className="space-y-4">
            {displayedActivities.map((activity) => (
              <li key={activity.log.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start  space-x-4 space-x-reverse">
                  <div className="flex-1 text-right">

                      <Badge variant="secondary" className={`bg-random-500 text-white`}>
                        {activity.module}
                      </Badge>
                    <span className="text-sm text-gray-500 text-right">
                    {format(new Date(activity.log.created_at), "d בMMMM yyyy, HH:mm", { locale: he })}
                    </span>
                    <div className="flex items-center flex-row-reverse gap-2">
                      <Avatar className="mt-1">

                        <AvatarImage src={`/avatars/user-${activity.user_id}.jpg`} alt="User Avatar" />
                        <AvatarFallback>{activity.user.first_name[0]}{activity.user.last_name[0]}</AvatarFallback>
                      </Avatar>
                        <p className="mt-1 text-sm font-medium">{activity.user.first_name} {activity.user.last_name}</p>
                    </div>


                    <p className="mt-1 text-sm text-gray-700">{activity.log.description}</p>
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="details">

                        <AccordionTrigger>פרטים נוספים</AccordionTrigger>
                        <AccordionContent>
                          <ActivityDetails activity={activity.log} />
                        </AccordionContent>

                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

