'use client'
import { useProject } from "@/components/ProjectContext";
import OverviewLayout from "../OverviewLayout";
import { Button } from "@/components/ui/button";
import { Check, Circle, CheckCircle2, Pencil, PlayCircle, X } from "lucide-react";
import { format, formatDistance } from "date-fns";
import {  useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { DatePickerDemo } from "@/components/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { he } from 'date-fns/locale/he'
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Client-side only formatting to avoid hydration mismatch
function ClientSideDate({ date }: { date: Date | string | null }) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  
  useEffect(() => {
    if (date) {
      setFormattedDate(format(new Date(date), "dd/MM/yyyy"));
    }
  }, [date]);
  
  return <span>{formattedDate}</span>;
}

// Client-side only distance calculation
function ClientSideDistance({ start, end }: { start: Date | string | null, end: Date | string | null }) {
  const [distance, setDistance] = useState<string>("");
  
  useEffect(() => {
    if (start && end) {
      setDistance(formatDistance(new Date(end), new Date(start), {locale: he}));
    }
  }, [start, end]);
  
  return <span>{distance}</span>;
}

type Status = "planned" | "in-progress" | "completed"
interface Milestone {
  id: string
  title: string
  description: string
  due_date: Date
  status: Status
}

export default function Milestones({startDate, endDate, milestones}: {startDate: Date | null, endDate: Date | null, milestones: Milestone[]}) {
    const {editMode, setEditMode, editing} = useProject();
    // TODO: get project id from url
    const projectId = useParams();
    const [progress, setProgress] = useState(33);
    const [projectStartDate, setProjectStartDate] = useState<Date | null>(startDate ?? new Date());
    const [projectEndDate, setProjectEndDate] = useState<Date | null>(endDate ?? new Date());
    const [isLoading, setIsLoading] = useState(false);

    // Initialize loading state on client-side only
    useEffect(() => {
        setIsLoading(false);
    }, []);
    
    const handleProjectEdit = async () => {
      setIsLoading(true);
      const startEditDate = new Date(projectStartDate as string);
      const endEditDate = new Date(projectEndDate as string);
      if(startDate?.getDay() === startEditDate.getDay() && endDate?.getDay() === endEditDate.getDay() && 
      startDate?.getMonth() === startEditDate.getMonth() && endDate?.getMonth() === endEditDate.getMonth() && 
      startDate?.getFullYear() === startEditDate.getFullYear() && endDate?.getFullYear() === endEditDate.getFullYear()) {
        setIsLoading(false);
        return;
      }
      
      const body = {
        start_date: startEditDate.toISOString(),
        end_date: endEditDate.toISOString() 
      }
      try {
        const response = await fetch(`/api/projects/${projectId.id}/update`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
        if (!response.ok) {
          throw new Error('Failed to update project')
        }

      } catch (error) {
          console.error(error)
        } finally {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      setEditMode(null);
    }
    const handleCancelProjectEdit = () => {
      setProjectStartDate(startDate ?? new Date());
      setProjectEndDate(endDate ?? new Date());
      setEditMode(null);
    }
    const milestoneProg = {
      total_milestones: milestones.length,
      completed: milestones.filter(milestone => milestone.status === 'completed').length,
      in_progress: milestones.filter(milestone => milestone.status === 'in-progress').length,
      not_started: milestones.filter(milestone => milestone.status !== 'completed' && milestone.status !== 'in-progress').length,
    }
    useEffect(() => {
      // Calculate progress on client-side only to avoid hydration mismatch
      if (milestoneProg.total_milestones > 0) {
        setProgress(milestoneProg.completed / milestoneProg.total_milestones * 100)
      }
    }, [milestoneProg])

    const header = (
        <div className="flex justify-between w-full">
            <p>ציר זמן ואבני דרך</p>

            {editMode !== 'milestones' ?  
            <>
              <Button variant="ghost" onClick={() => setEditMode(prev => prev === 'milestones' ? null : 'milestones')}>
                <Pencil className="ml-2 h-2 w-2" />
              </Button>
            </> :(
                <div className="flex gap-2">
                  <MilestoneDialog milestoneProgress={milestones} projectId={projectId} />
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
        <OverviewLayout header={editing ? header : "ציר זמן ואבני דרך"}>
            {
                isLoading ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Skeleton className="h-24 rounded-lg" />
                      <Skeleton className="h-24 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      <Skeleton className="h-20 rounded-lg" />
                      <Skeleton className="h-20 rounded-lg" />
                      <Skeleton className="h-20 rounded-lg" />
                    </div>
                  </div>
                ) : editMode === 'milestones' ? (
                  <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">תאריך התחלה</div>
                      <DatePickerDemo userdate={projectStartDate} onChange={setProjectStartDate} />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">תאריך סיום</div>
                      <DatePickerDemo userdate={projectEndDate} onChange={setProjectEndDate} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">התקדמות כללית</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {startDate && endDate && (
                      <div className="text-sm text-muted-foreground">זמן תקופת הפרוייקט: {formatDistance(endDate, startDate, {locale: he })}</div>
                    )}
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">{milestoneProg.completed}</div>
                        <div className="text-sm text-muted-foreground">משימות הושלמו</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <PlayCircle className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{milestoneProg.in_progress}</div>
                        <div className="text-sm text-muted-foreground">בתהליך</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Circle className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">{milestoneProg.not_started}</div>
                        <div className="text-sm text-muted-foreground">טרם התחילו</div>
                      </div>
                    </div>
                  </div>
                </div>                  
                ) : (
                    <>     
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          {startDate && 
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">תאריך התחלה</div>
                          <div className="font-medium"><ClientSideDate date={startDate} /></div>
                          </div>
                          }
                          {endDate && 
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">תאריך סיום</div>
                          <div className="font-medium"><ClientSideDate date={endDate} /></div>
                          </div>
                          }
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">התקדמות כללית</span>
                            <span className="font-medium">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          {startDate && endDate && (
                            <div className="text-sm text-muted-foreground">זמן תקופת הפרוייקט: <ClientSideDistance start={startDate} end={endDate} /></div>
                          )}
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <div>
                              <div className="font-medium">{milestoneProg.completed}</div>
                              <div className="text-sm text-muted-foreground">משימות הושלמו</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <PlayCircle className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{milestoneProg.in_progress}</div>
                              <div className="text-sm text-muted-foreground">בתהליך</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                            <Circle className="w-5 h-5 text-slate-400" />
                            <div>
                              <div className="font-medium">{milestoneProg.not_started}</div>
                              <div className="text-sm text-muted-foreground">טרם התחילו</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                )
            }
        </OverviewLayout>
    )
}

export function MilestoneDialog({milestoneProgress, projectId}: {milestoneProgress: any, projectId: string | null}) {
  const [milestones, setMilestones] = useState<Milestone[]>(milestoneProgress)
  const [newMilestoneAdded, setNewMilestoneAdded] = useState<Milestone | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogLoading, setIsDialogLoading] = useState(false)
  const router = useRouter();

  // Initialize dialog and loading states on client-side only
  useEffect(() => {
    setIsDialogLoading(false);
    setIsDialogOpen(false);
  }, []);

  const editingMilestone = editingId ? milestones.find(m => m.id === editingId) || null : null

  const updateEditingMilestone = (updates: Partial<Milestone>) => {
    if (!editingId) return
    setMilestones(prev => prev.map(m => 
      m.id === editingId ? { ...m, ...updates } : m
    ))
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusText = (status: Status) => {
    switch (status) {
      case "completed":
        return "הושלם"
      case "in-progress":
        return "בביצוע"
      default:
        return "מתוכנן"
    }
  }
   const handleSaveMileStone = () => {
    setEditingId(null)
    setNewMilestoneAdded(null)
   }
  const handleSave = async () => {
    if(!projectId) return;
    setIsDialogLoading(true);

    const body = {
      milestones: {
        milestones: milestones
      }
    }
    try {
      const response = await fetch(`/api/projects/${projectId.id}/update`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error('Failed to update project')
      }

    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        setIsDialogLoading(false);
        setEditingId(null);
        setIsDialogOpen(false);
      }, 500);
    }
  }
  const handleCancelNewMilestone = () => {
    setNewMilestoneAdded(null)
    setMilestones(milestones.filter((m) => m.id !== newMilestoneAdded?.id))
    setEditingId(null)
  }
  const handleDelete = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const [idSeed, setIdSeed] = useState("initial");
  
  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    setIdSeed(String(Date.now()));
  }, []);

  const addNewMilestone = () => {
    const newMilestone: Milestone = {
      id: idSeed + "-" + String(Math.random()).substring(2, 8),
      title: "אבן דרך חדשה",
      description: "",
      due_date: new Date(),
      status: "planned",
    }
    setNewMilestoneAdded(newMilestone)
    setMilestones([...milestones, newMilestone])
    setEditingId(newMilestone.id)
  }


  return (
    <div dir="rtl">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Pencil className="h-4 w-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-right">ניהול אבני דרך</DialogTitle>
            <DialogDescription className="text-right">ערוך, הוסף או מחק אבני דרך לפרויקט.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex flex-col min-h-0">
            <Button onClick={addNewMilestone} className="mb-4 self-start">
              <Plus className="h-4 w-4 ml-2" />
              הוסף אבן דרך
            </Button>
            <div className="h-[150px] overflow-auto flex-1 border rounded-md">
              {isDialogLoading ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-background text-right">סטטוס</TableHead>
                      <TableHead className="sticky top-0 bg-background text-right">שם</TableHead>
                      <TableHead className="sticky top-0 bg-background text-right">תאריך</TableHead>
                      <TableHead className="sticky top-0 bg-background text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {milestones.map((milestone) => (
                      <TableRow key={milestone.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)}`} />
                            <span>{getStatusText(milestone.status)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{milestone.title}</TableCell>
                        <TableCell><ClientSideDate date={milestone.due_date} /></TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(milestone.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(milestone.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>)}
            </div>
          </div>
          {editingMilestone && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                {editingMilestone.id === newMilestoneAdded?.id ? "הוספת אבן דרך חדשה" : "עריכת אבן דרך"}
              </h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <label htmlFor="title">כותרת</label>
                  <Input
                    id="title"
                    value={editingMilestone.title}
                    onChange={(e) => updateEditingMilestone({ title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label>תאריך</label>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-right">
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        <ClientSideDate date={editingMilestone.due_date} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editingMilestone.due_date}
                        onSelect={(date) => date && updateEditingMilestone({ due_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label>סטטוס</label>
                  <Select
                    dir="rtl"
                    value={editingMilestone.status}
                    onValueChange={(value: Status) => updateEditingMilestone({ status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-right">
                      <SelectItem value="planned">מתוכנן</SelectItem>
                      <SelectItem value="in-progress">בביצוע</SelectItem>
                      <SelectItem value="completed">הושלם</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleCancelNewMilestone} variant="outline">
                    ביטול
                  </Button>
                  <Button onClick={handleSaveMileStone}>עדכן שינויים</Button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 border-t pt-6 flex justify-center">
            <Button onClick={handleSave}>שמור שינויים</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
