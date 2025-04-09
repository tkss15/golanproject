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

type Manager = {
  id: number
  full_name: string
  company_name?: string
}

interface ProjectManagerPopupProps {
  managers: Manager[]
  value: string
  onChange: (value: string) => void
}

export function ProjectManagerPopup({ managers, value, onChange }: ProjectManagerPopupProps) {
  const [open, setOpen] = React.useState(false)

  const selectedManager = managers.find((manager) => manager.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? `${selectedManager?.full_name}${selectedManager?.company_name ? ` (${selectedManager.company_name})` : ''}`
            : "בחר מנהל פרויקט..."}
          <ChevronsUpDown className="opacity-50 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="חיפוש מנהל פרויקט..." className="h-9" />
          <CommandList>
            <CommandEmpty>לא נמצאו מנהלי פרויקט</CommandEmpty>
            <CommandGroup>
              {managers.map((manager) => (
                <CommandItem
                  key={manager.id}
                  value={manager.id.toString()}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span>{manager.full_name}</span>
                    {manager.company_name && (
                      <span className="text-xs text-gray-500">{manager.company_name}</span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto",
                      value === manager.id.toString() ? "opacity-100" : "opacity-0"
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
