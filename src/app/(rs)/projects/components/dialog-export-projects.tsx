"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarIcon, Download } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarWithYearNav } from "@/components/ui/calendarwithyear"
import { he } from "date-fns/locale"

interface Department {
  id: number;
  department_name: string;
  project_type: string;
}

interface Settlement {
  settlement_id: number;
  name: string;
}

interface DialogExportProjectsProps {
  open: boolean;
  onClose: () => void;
  departments: Department[];
  settlements: Settlement[];
}

export default function DialogExportProjects({
  open,
  onClose,
  departments,
  settlements
}: DialogExportProjectsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all_departments");
  const [selectedSettlement, setSelectedSettlement] = useState<string>("all_settlements");
  const [isExporting, setIsExporting] = useState(false);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    
    // If end date is before the new start date, clear end date
    if (endDate && date && date > endDate) {
      setEndDate(undefined);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    
    // If start date is after the new end date, update the start date
    if (startDate && date && date < startDate) {
      setStartDate(date);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Prepare filter params
      const filters: Record<string, string> = {};
      
      if (selectedDepartment && selectedDepartment !== "all_departments") {
        filters.department_id = selectedDepartment;
      }
      
      if (selectedSettlement && selectedSettlement !== "all_settlements") {
        filters.settlement_id = selectedSettlement;
      }
      
      if (startDate) {
        filters.start_date = format(startDate, "yyyy-MM-dd");
      }
      
      if (endDate) {
        filters.end_date = format(endDate, "yyyy-MM-dd");
      }
      
      // Create query string from filters
      const queryParams = new URLSearchParams(filters).toString();
      
      // Call API endpoint with filters
      const response = await fetch(`/api/projects/export?${queryParams}`, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error("Failed to export projects");
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const currentDate = format(new Date(), "yyyy-MM-dd");
      a.href = url;
      a.download = `projects-report-${currentDate}.xlsx`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error exporting projects:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent dir="rtl" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-right">ייצוא דוח פרויקטים</DialogTitle>
          <DialogDescription className="text-right">
            בחר פילטרים לייצוא הפרויקטים לקובץ אקסל.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              מחלקה
            </Label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger dir="rtl" className="col-span-3">
                <SelectValue placeholder="בחר מחלקה" />
              </SelectTrigger>
              <SelectContent dir="rtl" className="text-right">
                <SelectItem value="all_departments">כל המחלקות</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.department_name} {dept.project_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="settlement" className="text-right">
              ישוב
            </Label>
            <Select
              value={selectedSettlement}
              onValueChange={setSelectedSettlement}
            >
              <SelectTrigger dir="rtl" className="col-span-3">
                <SelectValue placeholder="בחר ישוב" />
              </SelectTrigger>
              <SelectContent dir="rtl" className="text-right">
                <SelectItem value="all_settlements">כל הישובים</SelectItem>
                {settlements.map((settlement) => (
                  <SelectItem key={settlement.settlement_id} value={settlement.settlement_id.toString()}>
                    {settlement.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right">
              מתאריך
            </Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`col-span-3 justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", {locale: he}) : <span>בחר תאריך</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarWithYearNav
                  mode='single'
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right">
              עד תאריך
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
                <CalendarWithYearNav
                  mode='single'
                  startMonth={startDate ?? new Date()}
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "מייצא..." : "ייצא דוח"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}