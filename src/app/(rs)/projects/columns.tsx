"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Department = {
    id: string
    department_name: string
    project_type: string
}

export const columns: ColumnDef<Department>[] = [
    // {
    //     accessorKey: "id",
    //     header: ({ column }) => {
    //         return (
    //             <div className="text-right">
    //                 <Button
    //                     variant="ghost"
    //                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                     >
    //                     <ArrowUpDown className="ml-2 h-4 w-4" />
    //                     מזהה מחלקה
    //                 </Button>
    //             </div>
    //         )
    //       },
    // },
    {
        accessorKey: "department_name",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        מחלקה
                    </Button>
                </div>
            )
          },
          cell: ({ row }) => (
            <>
                <Badge variant="outline">{row.original.department_name}</Badge> {row.original.project_type}
            </>
        ),
    },
    // {
    //     accessorKey: "type",
    //     header: () => <div className="text-right">סוג אשכול</div>,
    // },
]
