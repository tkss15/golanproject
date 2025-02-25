"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function DepartmentsPopup({departments, onUpdate, currentDepartment}: {departments: {id: number, department_name: string, project_type: string}[], onUpdate: (department_id: number) => void, currentDepartment: string  }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(currentDepartment)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? departments.find((department) => department.id === parseInt(value))?.department_name
            : "בחר מחלקה..."}



          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="חיפוש מחלקה..." className="h-9" />
          <CommandList>

            <CommandEmpty>לא נמצאה מחלקה</CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.id.toString()}
                  onSelect={(currentValue) => {
                    onUpdate(parseInt(currentValue))
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {department.department_name} {department.project_type}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === department.id.toString() ? "opacity-100" : "opacity-0"
                    )}

                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
