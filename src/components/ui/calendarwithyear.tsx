"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarIcon } from "lucide-react"
import { format, isBefore, isAfter } from "date-fns"
import { he } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DatePickerWithYearNav() {
  const [date, setDate] = React.useState<Date>()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Date Picker with Year Selection</h2>

      <Popover modal={true} open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: he }) : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarWithYearNav
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              setIsOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {date && (
        <div className="mt-4 text-center">
          <p className="text-lg">
            Selected date: <span className="font-medium">{format(date, "PPP")}</span>
          </p>
        </div>
      )}
    </div>
  )
}

interface CalendarWithYearNavProps extends React.ComponentProps<typeof Calendar> {
  startMonth?: Date; // Minimum selectable date (for end date selection)
  endMonth?: Date;   // Maximum selectable date (for start date selection)
}

export function CalendarWithYearNav({ className, classNames, startMonth, endMonth, ...props }: CalendarWithYearNavProps) {
  const [currentDate, setCurrentDate] = React.useState<Date>(
    props.selected instanceof Date ? props.selected : new Date(),
  )
  
  const [showYearPicker, setShowYearPicker] = React.useState(false)
  const [yearRangeStart, setYearRangeStart] = React.useState(() => {
    const year = (props.selected instanceof Date ? props.selected : new Date()).getFullYear()
    return Math.floor(year / 16) * 16
  })

  // Update currentDate when selected date changes
  React.useEffect(() => {
    if (props.selected instanceof Date) {
      setCurrentDate(props.selected)
    }
  }, [props.selected])

  const handleYearClick = () => {
    setShowYearPicker(true)
  }

  const handleYearSelect = (year: number) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setFullYear(year)
      return newDate
    })
    setShowYearPicker(false)
  }

  const handlePreviousYearRange = () => {
    setYearRangeStart((prev) => prev - 16)
  }

  const handleNextYearRange = () => {
    setYearRangeStart((prev) => prev + 16)
  }

  // Custom function to determine if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // If startMonth is provided (meaning this is an end date picker)
    // then disable dates before startMonth
    if (startMonth && isBefore(date, startMonth)) {
      return true
    }
    
    // If endMonth is provided (meaning this is a start date picker)
    // then disable dates after endMonth
    if (endMonth && isAfter(date, endMonth)) {
      return true
    }
    
    return false
  }

  const renderYearPicker = () => {
    const years = []
    for (let i = 0; i < 16; i++) {
      years.push(yearRangeStart + i)
    }

    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePreviousYearRange}>
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Previous years</span>
          </Button>
          <div className="font-medium">
            {yearRangeStart} - {yearRangeStart + 15}
          </div>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextYearRange}>
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Next years</span>
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={year === currentDate.getFullYear() ? "default" : "outline"}
              className="h-9"
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </Button>
          ))}
        </div>
        <div className="mt-2 flex">
          <Button variant="ghost" size="sm" onClick={() => setShowYearPicker(false)}>
            ביטול
          </Button>
        </div>
      </div>
    )
  }

  const renderCalendarHeader = () => {
    return (
      <div className="flex items-center justify-between px-3 absolute top-0 w-full z-10 bg-white">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            const newDate = new Date(currentDate)
            newDate.setMonth(newDate.getMonth() - 1)
            setCurrentDate(newDate)
          }}
        >
          <ChevronRight className="h-4 w-4" />

          <span className="sr-only">Previous month</span>
        </Button>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" onClick={handleYearClick} className="font-medium">
            {format(currentDate, "yyyy" , { locale: he })}
          </Button>
          <span className="font-medium">{format(currentDate, "MMMM", { locale: he })}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            const newDate = new Date(currentDate)
            newDate.setMonth(newDate.getMonth() + 1)
            setCurrentDate(newDate)
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showYearPicker ? (
        renderYearPicker()
      ) : (
        <>
            <div className="relative">
                {renderCalendarHeader()}
                <Calendar
                    {...props}
                    className={cn("", className)}
                    classNames={{
                    ...classNames,
                    // head_cell: cn("text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]", classNames?.head_cell),
                    }}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    showOutsideDays={true}
                    disabled={isDateDisabled}
                />
            </div>
        </>
      )}
    </div>
  )
}
