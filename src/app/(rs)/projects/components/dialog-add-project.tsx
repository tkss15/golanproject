"use client"

import type React from "react"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Mail, Phone, AlertTriangle, Users2, FolderKanban, CheckCircle2, HousePlusIcon, ChevronsUpDown, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";
import { UserList } from "@/components/user/UserList"
import { UserListSkeleton } from "@/components/user/UserList"
import { InvitedUser } from "@/zod-schemas/users"
import { Settlement } from "../../cities/columns"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { he } from "date-fns/locale"
import { useToast } from "@/hooks/useToast"

interface Department {
  id: number;
  department_name: string;
  project_type: string;
  project_count: number;
}

export default function DialogAddProject({
  departments,
  settlements
}: {
  departments: Department[]
  settlements: Settlement[]
}) {
  const [open, setOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<InvitedUser[]>([])
  const router = useRouter();
  const toast = useToast()
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    budget: "",
    start_date: "",
    end_date: "",
    status: "",
    priority: "",
    department_id: "",
    contact_email: "",
    contact_phone: "",
    settlement_id: "",
  })
  const { user:KindeUser } = useKindeBrowserClient()

  const steps = [
    { id: 1, title: "פרטי פרויקט", icon: FolderKanban, middle: false },
      { id: 2, title: "ישובים ומחלקות", icon: HousePlusIcon, middle: false },
      { id: 3, title: "צוות", icon: Users2, middle: false  },
      { id: 4, title: "סיכום ואישור", icon: CheckCircle2, middle: false },
  ]

  const translations = {
    name: "שם פרויקט",
    description: "תיאור",
    budget: "תקציב",
    startDate: "תאריך התחלה",
    endDate: "תאריך סיום",
    status: "סטטוס",
    priority: "עדיפות",
    department: "מחלקה",
    email: "דוא״ל",
    phone: "טלפון",
    settlement: "ישוב",
  }
  const handleUserSelection = (user: User) => {

    const newInvitedUser: InvitedUser = {
      user: user,
      joined_date: new Date(),
      added_by: {id: "-1"}
    }
    setSelectedUsers(prev =>
      prev.some(u => u.user.id === user.id)
        ? prev.filter(u => u.user.id !== user.id)
        : [...prev, newInvitedUser]
    )
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, end_date: format(selectedDate, "yyyy-MM-dd") }))
    }
  }
  const handleEndDateSelect = (selectedDate: Date | undefined) => {
    setEndDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, end_date: format(selectedDate, "yyyy-MM-dd") }))
    }
  }
  const handleOpenChange = () => {
    router.back();
  }
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
        project: {
          project_name: formData.project_name,
          description: formData.description,
          budget: formData.budget,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          status: formData.status,
          priority: formData.priority,
          department_id: formData.department_id,
          contact_email: formData.contact_email,  
          contact_phone: formData.contact_phone,
        },
        editors: selectedUsers.map(user => user.user.id),
        settlement: formData.settlement_id,
      }),
    })
    if (!response.ok) {
      throw new Error("Failed to create project");
    }
    const data = await response.json();
    setOpen(false)
    setStep(1)
    router.push(`/projects/${data.project.id}`)
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("שימו לב שהפרטים שהוזנו תקינים", "שימו לב שהפרטים שהוזנו תקינים", 5000)
    }

  }
  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleOpenChange}>
      <DialogContent dir="rtl" className="top-[100%] max-w-full translate-y-[-100%]  sm:max-w-[425px] sm:top-[50%] sm:translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle className="text-right">צור פרויקט חדש{steps[step - 1].middle ? ' - המשך' : ''}</DialogTitle>
          <DialogDescription className="text-right">מלא את הפרטים של הפרויקט. השדות המסומנים ב* הם חובה.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {step === 1 && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project_name" className="text-right">
                  {translations.name}*
                </Label>
                <Input
                  id="project_name"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  {translations.description}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  {translations.budget}
                </Label>
                <div className="col-span-3 relative">
                  <span className="absolute left-2 top-1 h-4 w-4 text-muted-foreground">₪</span>
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">
                  {translations.startDate}
                </Label>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`col-span-3 justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", {locale: he}) : <span>בחר תאריך</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  {translations.endDate}
                </Label>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`col-span-3 justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", {locale: he}) : <span>בחר תאריך</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  {translations.status}*
                </Label>
                <Select onValueChange={(value) => handleSelectChange("status", value)} defaultValue={formData.status}>
                  <SelectTrigger dir="rtl" className="col-span-3">
                    <SelectValue placeholder="בחר סטטוס פרוייקט" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="text-right">
                  <SelectItem value="פעיל">פעיל</SelectItem>
                  <SelectItem value="בתכנון">בתכנון</SelectItem>
                  <SelectItem value="מעוכב">מעוכב</SelectItem>
                  <SelectItem value="סגור">סגור</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="settlement_id" className="text-right">
                  {translations.settlement}*
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("settlement_id", value)}
                  defaultValue={formData.settlement_id}
                >
                  <SelectTrigger dir="rtl" className="col-span-3">
                    <SelectValue placeholder="בחר ישוב" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="text-right">
                    {settlements.map((settlement) => (
                      <SelectItem key={settlement.settlement_id} value={settlement.settlement_id.toString()}>
                        {settlement.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department_id" className="text-right">
                  {translations.department}*
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("department_id", value)}
                  defaultValue={formData.department_id}
                >
                  <SelectTrigger dir="rtl" className="col-span-3">
                    <SelectValue placeholder="בחר מחלקה" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="text-right">
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.department_name} {dept.project_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  {translations.priority}
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("priority", value)}
                  defaultValue={formData.priority}
                >
                  <SelectTrigger dir="rtl" className="col-span-3">
                    <SelectValue placeholder="בחר עדיפות" />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="1">נמוך</SelectItem>
                    <SelectItem value="2">בינונית</SelectItem>
                    <SelectItem value="3">גבוהה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_email" className="text-right">
                  {translations.email}
                </Label>
                <div className="col-span-3 relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_phone" className="text-right">
                  {translations.phone}
                </Label>
                <div className="col-span-3 relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <Input
                placeholder="חפש אישים..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}

              />
              
              <Suspense fallback={<UserListSkeleton />}>
                <UserList
                  search={search}
                  selectedUsers={selectedUsers}
                  onUserSelect={handleUserSelection}
                  avoidSelf={KindeUser?.id}
                />
              </Suspense>
            </>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">סיכום פרויקט</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">{translations.name}:</span>
                <span>{formData.project_name !== "" ? formData.project_name : "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.description}:</span>
                <span>{formData.description || "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.budget}:</span>
                <span>{formData.budget ? `$${formData.budget}` : "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.endDate}:</span>
                <span>{formData.end_date || "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.status}:</span>
                <span>{formData.status !== "" ? formData.status : "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.priority}:</span>
                <span>
                  {formData.priority !== "" ? ["נמוך", "בינונית", "גבוהה"][Number.parseInt(formData.priority) - 1] : "לא ניתן להציג"}
                </span>
                <span className="font-semibold">{translations.department}:</span>
                <span>
                  {formData.department_id
                    ? departments.find(dept => dept.id.toString() === formData.department_id)?.department_name || "לא ניתן להציג"
                    : "לא ניתן להציג"}
                </span>
                <span className="font-semibold">{translations.settlement}:</span>
                <span>
                  {formData.settlement_id
                    ? settlements.find(settlement => settlement.settlement_id.toString() === formData.settlement_id)?.name || "לא ניתן להציג"
                    : "לא ניתן להציג"}
                </span>
                <span className="font-semibold">{translations.email}:</span>
                <span>{formData.contact_email || "לא ניתן להציג"}</span>
                <span className="font-semibold">{translations.phone}:</span>
                <span>{formData.contact_phone || "לא ניתן להציג"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">צוות הפרויקט:</span>
                <span>
                  {selectedUsers.map(user => user.user.first_name + " " + user.user.last_name).join(", ")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">אנא בדקו את הפרטים לפני שמסכמים.</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col space-y-4 sm:space-y-0 sm:flex-col">
          <div className="w-full mb-4">
            <div className="flex justify-between items-center relative">
              {steps.map((s, i) => (
                <div key={s.id} className="flex flex-col items-center z-10">
                  
                  {!s.middle ? (
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                        cursor-pointer transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(s.id)}
                  >
                    {s.icon && <s.icon className="w-5 h-5" />}
                  </motion.div> ) : <></>}
                  {!s.middle && <span className="text-sm mt-2">{s.title}</span>}
                  {i < steps.length - 1 && (
                    <div 
                      className={`absolute h-[2px] top-5 -z-10
                        ${step > i + 1 ? 'bg-primary' : 'bg-muted'}`}
                      style={{
                        right: `${(i * (s.middle ? 25 : 25)) + 10}%`,
                        width: '40%',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between w-full">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                חזרה
              </Button>
            )}
            {step < steps.length  ? (
              <Button className="mr-auto" onClick={() => setStep(step + 1)}>
                הבא
              </Button>
            ) : (
              <Button className="mr-auto" onClick={handleSubmit}>
                יצירת פרויקט
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
