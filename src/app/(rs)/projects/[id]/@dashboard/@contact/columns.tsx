"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Funding = {
    name: string
    budget: string
}


export const columns: ColumnDef<Funding>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        מקור המימון
                    </Button>
                </div>

            )
          },
          cell: ({ row }) => (
            row.original.name
        ),
    },
    {
        accessorKey: "budget",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        סכום
                    </Button>
                </div>

            )
          },
          cell: ({ row }) => (
            row.original.budget
        ),
    },
]
