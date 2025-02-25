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


export function OwnerUsersPopup({users}: {users: {id: number, first_name: string, last_name: string}[]}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")



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
            ? users.find((user) => user.id === parseInt(value))?.first_name + " " + users.find((user) => user.id === parseInt(value))?.last_name
            : "בחר משתתפים..."}




          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="חיפוש משתתפים..." className="h-9" />
          <CommandList>


            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem

                  key={user.id}
                  value={user.id.toString()}

                  onSelect={(currentValue) => {

                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {user.first_name} {user.last_name}
                  <Check

                    className={cn(
                      "ml-auto",
                      value === user.id.toString() ? "opacity-100" : "opacity-0"
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
