"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User } from "@/zod-schemas/users"
import { ArrowRight, FileText, CheckCircle, Calendar, Tag, DollarSign, Mail, Phone, MapPin, MessageSquare } from "lucide-react"
import { usePolling } from "@/hooks/usePolling"
import { AddNote } from "./AddNote"
interface LogType {
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
  else return (bytes / 1073741824).toFixed(1) + " GB"
}

// Helper function to format date strings to Hebrew format
function formatHebrewDate(dateString: string) {
  if (!dateString) return 'לא צוין';
  try {
    return format(new Date(dateString), "d בMMMM yyyy", { locale: he });
  } catch (e) {
    return dateString;
  }
}

// Helper to get priority text
function getPriorityText(priority: string) {
  switch (priority) {
    case "1": return "נמוך";
    case "2": return "בינונית";
    case "3": return "גבוהה";
    default: return priority;
  }
}

function ActivityDetails({ activity }: { activity: ActivityLog }) {

  const getActivityIcon = () => {
    switch (activity.action_type) {
      case "עדכון_פרטים":
        return <Tag className="h-5 w-5 text-blue-500" />;
      case "הוספת_ישוב":
        return <MapPin className="h-5 w-5 text-green-500" />;
      case "עדכון_תקציב":
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case "העלאת_קובץ":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "טקסט_חופשי":
        return <MessageSquare className="h-5 w-5 text-teal-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (activity.action_type === "עדכון_פרטים") {
    return (
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          {getActivityIcon()}
          <h4 className="font-medium text-blue-700">עדכון פרטי פרויקט</h4>
        </div>
        
        <div className="space-y-3">
          {/* Fallback if no fields are found */}
          {(!activity.previous_state || !activity.new_state) && (
            <div className="p-3 bg-blue-100/50 rounded-md">
              <p className="text-blue-700 text-center">לא נמצאו שינויים מפורטים</p>
            </div>
          )}
          
          {activity.previous_state && activity.new_state && activity.previous_state.project_name !== undefined && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">שם הפרויקט</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <span className="line-through text-gray-400">{activity.previous_state.project_name}</span>
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-600">{activity.new_state.project_name}</span>
              </div>
            </div>
          )}
          
          {activity.previous_state && activity.new_state && activity.previous_state.description !== undefined && activity.previous_state.description !== activity.new_state.description && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">תיאור</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <span className="line-through text-gray-400 truncate max-w-[150px]">{activity.previous_state.description}</span>
                <ArrowRight className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="font-medium text-blue-600 truncate max-w-[150px]">{activity.new_state.description}</span>
              </div>
            </div>
          )}
          
          {activity.previous_state && activity.new_state && activity.previous_state.end_date !== undefined && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">תאריך סיום</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="line-through">{formatHebrewDate(activity.previous_state.end_date)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <div className="flex items-center gap-1 text-blue-600 font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{formatHebrewDate(activity.new_state.end_date)}</span>
                </div>
              </div>
            </div>
          )}

          {activity.previous_state && activity.new_state && activity.previous_state.start_date !== undefined && activity.previous_state.start_date !== activity.new_state.start_date && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">תאריך התחלה</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="line-through">{formatHebrewDate(activity.previous_state.start_date)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <div className="flex items-center gap-1 text-blue-600 font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>{formatHebrewDate(activity.new_state.start_date)}</span>
                </div>
              </div>
            </div>
          )}
          
          {activity.previous_state && activity.new_state && activity.previous_state.status !== undefined && activity.previous_state.status !== activity.new_state.status && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">סטטוס</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <Badge variant="outline" className="line-through text-gray-400 bg-gray-50">{activity.previous_state.status}</Badge>
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{activity.new_state.status}</Badge>
              </div>
            </div>
          )}
          
          {activity.previous_state && activity.new_state && activity.previous_state.priority !== undefined && activity.previous_state.priority !== activity.new_state.priority && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">עדיפות</span>
              <div className="flex items-center gap-3 bg-white p-2 rounded border border-blue-100">
                <Badge variant="outline" className="line-through text-gray-400 bg-gray-50">{getPriorityText(activity.previous_state.priority)}</Badge>
                <ArrowRight className="h-4 w-4 text-blue-400" />
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{getPriorityText(activity.new_state.priority)}</Badge>
              </div>
            </div>
          )}
          
          {activity.metadata && activity.metadata.update_reason && (
            <div className="mt-4 p-3 bg-blue-100/50 rounded-md">
              <span className="text-sm text-gray-500 block mb-1">סיבת העדכון</span>
              <p className="text-blue-700">{activity.metadata.update_reason}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  if (activity.action_type === "הוספת_ישוב") {
    return (
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          {getActivityIcon()}
          <h4 className="font-medium text-green-700">הוספת ישוב</h4>
        </div>
        
        {activity.previous_state && activity.new_state && activity.previous_state.settlements && activity.new_state.settlements ? (
          <div className="flex gap-4 mb-4">
            <div className="flex-1 bg-white p-3 rounded-md border border-green-100">
              <span className="text-sm text-gray-500 block mb-2">ישובים קודמים</span>
              <ul className="space-y-1">
                {activity.previous_state.settlements.map((settlement: string, i: number) => (
                  <li key={i} className="text-gray-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    {settlement}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 bg-white p-3 rounded-md border border-green-200">
              <span className="text-sm text-gray-500 block mb-2">ישובים כעת</span>
              <ul className="space-y-1">
                {activity.new_state.settlements.map((settlement: string, i: number) => (
                  <li 
                    key={i} 
                    className={`flex items-center gap-1 ${
                      i === activity.new_state.settlements.length - 1 
                        ? "text-green-600 font-medium" 
                        : "text-gray-600"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      i === activity.new_state.settlements.length - 1 
                        ? "bg-green-500" 
                        : "bg-gray-400"
                    }`}></span>
                    {settlement}
                    {i === activity.new_state.settlements.length - 1 && (
                      <Badge className="ml-1 text-xs bg-green-100 text-green-700 hover:bg-green-100">חדש</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-green-100/50 rounded-md mb-4">
            <p className="text-green-700 text-center">לא נמצאו פרטים על הישובים</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-md border border-green-100">
            <span className="text-sm text-gray-500 block mb-1">מזהה ישוב</span>
            <p className="text-green-700 font-medium">{activity.metadata?.settlement_id || "לא זמין"}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-green-100">
            <span className="text-sm text-gray-500 block mb-1">תקציב מוקצה</span>
            <p className="text-green-700 font-medium">
              {activity.metadata?.budget_allocation 
                ? `₪${activity.metadata.budget_allocation.toLocaleString()}`
                : "לא זמין"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (activity.action_type === "עדכון_תקציב") {
    return (
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          {getActivityIcon()}
          <h4 className="font-medium text-yellow-700">עדכון תקציב</h4>
        </div>
        
        {activity.previous_state && activity.new_state && activity.previous_state.budget !== undefined && activity.new_state.budget !== undefined ? (
          <div className="mb-4 flex items-center gap-3 bg-white p-3 rounded-md border border-yellow-100">
            <div className="flex flex-col text-center">
              <span className="text-sm text-gray-500">תקציב קודם</span>
              <span className="text-gray-500 line-through">₪{activity.previous_state.budget.toLocaleString()}</span>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-16 h-0.5 bg-yellow-200"></div>
                <div className="absolute -top-2 right-1/2 transform translate-x-1/2 bg-yellow-400 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  {((activity.new_state.budget - activity.previous_state.budget) / activity.previous_state.budget * 100).toFixed(0)}%+
                </div>
              </div>
            </div>
            
            <div className="flex flex-col text-center">
              <span className="text-sm text-gray-500">תקציב נוכחי</span>
              <span className="text-yellow-700 font-medium">₪{activity.new_state.budget.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-yellow-100/50 rounded-md mb-4">
            <p className="text-yellow-700 text-center">לא נמצאו פרטי תקציב</p>
          </div>
        )}
        
        {activity.previous_state?.funding_sources && activity.new_state?.funding_sources && (
          <div className="mb-4">
            <span className="text-sm text-gray-500 block mb-2">מקורות מימון</span>
            <div className="overflow-hidden rounded-md border border-yellow-100">
              {activity.new_state.funding_sources.map((source: any, index: number) => {
                const prevSource = activity.previous_state.funding_sources.find((s: any) => s.id === source.id);
                const prevAmount = prevSource ? prevSource.amount : 0;
                const diff = source.amount - prevAmount;
                const diffPercent = prevAmount ? (diff / prevAmount * 100).toFixed(0) : "N/A";
                
                return (
                  <div 
                    key={source.id} 
                    className={`flex items-center p-3 bg-white ${
                      index < activity.new_state.funding_sources.length - 1 ? "border-b border-yellow-100" : ""
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-medium">
                      {source.id}
                    </div>
                    
                    <div className="flex flex-col ml-3">
                      <span className="text-sm text-gray-500">סכום קודם</span>
                      <span className="text-gray-400 line-through">₪{prevAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                      <ArrowRight className="h-4 w-4 text-yellow-400" />
                    </div>
                    
                    <div className="flex flex-col mr-3">
                      <span className="text-sm text-gray-500">סכום נוכחי</span>
                      <span className="text-yellow-700 font-medium">₪{source.amount.toLocaleString()}</span>
                    </div>
                    
                    <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                      diff > 0 
                        ? "bg-green-100 text-green-700" 
                        : diff < 0 
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}>
                      {diff > 0 ? "+" : ""}{diffPercent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-md border border-yellow-100">
            <span className="text-sm text-gray-500 block mb-1">מספר אישור</span>
            <p className="text-yellow-700 font-medium">{activity.metadata?.approval_number || "לא זמין"}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-yellow-100">
            <span className="text-sm text-gray-500 block mb-1">אושר על ידי</span>
            <p className="text-yellow-700 font-medium">{activity.metadata?.approved_by || "לא זמין"}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (activity.action_type === "העלאת_קובץ") {
    return (
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          {getActivityIcon()}
          <h4 className="font-medium text-purple-700">העלאת קובץ</h4>
        </div>
        
        {activity.new_state && activity.new_state.file_name ? (
          <div className="bg-white p-4 rounded-md border border-purple-100 flex mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center text-purple-500">
              <FileText className="h-6 w-6" />
            </div>
            
            <div className="ml-4 flex-1">
              <h5 className="font-medium text-purple-700">{activity.new_state.file_name}</h5>
              <div className="flex gap-4 mt-1">
                <span className="text-sm text-gray-500">
                  {formatFileSize(activity.new_state.file_size)}
                </span>
                <span className="text-sm text-gray-500">
                  {activity.metadata?.file_type || ""}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-purple-100/50 rounded-md mb-4">
            <p className="text-purple-700 text-center">לא נמצאו פרטי קובץ</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-md border border-purple-100">
            <span className="text-sm text-gray-500 block mb-1">קטגוריה</span>
            <p className="text-purple-700 font-medium">{activity.metadata?.category || "לא זמין"}</p>
          </div>
          
          <div className="bg-white p-3 rounded-md border border-purple-100">
            <span className="text-sm text-gray-500 block mb-1">מזהה קובץ</span>
            <p className="text-purple-700 font-medium">{activity.new_state?.file_id || "לא זמין"}</p>
          </div>
        </div>
      </div>
    );
  }

  if (activity.action_type === "טקסט_חופשי") {
    return (
      <div className="bg-teal-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          {getActivityIcon()}
          <h4 className="font-medium text-teal-700">הערה</h4>
        </div>
        
        <div className="bg-white p-4 rounded-md border border-teal-100 mb-4">
          <div className="prose max-w-none text-teal-700">
            {activity.metadata?.text ? (
              <div>
                {activity.metadata.text.split('\n').map((line: string, i: number) => (
                  <p key={i} className="my-2">{line}</p>
                ))}
              </div>
            ) : (
              <p>אין תוכן להצגה</p>
            )}
          </div>
        </div>
        
        {activity.metadata?.tags && activity.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activity.metadata.tags.map((tag: string, i: number) => (
              <Badge key={i} className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Default case
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-gray-500" />
        <h4 className="font-medium text-gray-700">פעולה</h4>
      </div>
      
      <p className="text-gray-500">אין פרטים נוספים להצגה</p>
    </div>
  );
}

export function ActivityLog({ logs, project_id }: { logs: LogType[], project_id: number }) {
  const [displayedActivities, setDisplayedActivities] = useState(logs)

  useEffect(() => {
    setDisplayedActivities(prev => {
      return logs;
    });
  }, [logs])

  usePolling(20000)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-right">
          <div className="flex justify-between mb-4">
          יומן פעילויות 
              <AddNote projectId={project_id} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] overflow-y-auto">
          <ul className="space-y-4">
            {displayedActivities.map((activity) => (
              <li key={activity.log.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-1 text-right">
                    <Badge variant="secondary" className="bg-random-500 text-white">
                      {activity.log.module}
                    </Badge>
                    <span className="text-sm text-gray-500 text-right mr-2">
                      {format(new Date(activity.log.created_at), "d בMMMM yyyy, HH:mm", { locale: he })}
                    </span>
                    <div className="flex items-center flex-row-reverse gap-2">
                      <Avatar className="mt-1">
                        <AvatarImage src={`/avatars/user-${activity.user.id}.jpg`} alt="User Avatar" />
                        <AvatarFallback>{activity.user.first_name?.[0]}{activity.user.last_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <p className="mt-1 text-sm font-medium">{activity.user.first_name} {activity.user.last_name}</p>
                    </div>

                    <p className="mt-1 text-sm text-gray-700">{activity.log.description}</p>
                    {/* <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="details">
                        <AccordionTrigger>פרטים נוספים</AccordionTrigger>
                        <AccordionContent>
                          <ActivityDetails activity={activity.log} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion> */}
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
