"use client"

import * as React from "react"
import { format } from "date-fns"
// import the locale object
import { he } from 'date-fns/locale/he'
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo({userdate, onChange}: Readonly<{userdate?: Date | null, onChange?: (date: Date | null) => void}>) {
  const [date, setDate] = React.useState<Date | null>(userdate ?? new Date())

  const handleDateChange = (date: Date | null) => {
    setDate(date)
    onChange?.(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[full] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP", { locale: he }) : <span>בחר תאריך</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => handleDateChange(date)}
          initialFocus
          month={date} // Add this prop to set the displayed month
          locale={he}
        />
      </PopoverContent>
    </Popover>
  )
}
