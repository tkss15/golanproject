"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// This type is used to define the shape of our data.
export type Settlement = {
    settlement_id: string
    name: string
}

// Helper function to detect if we're on mobile
export const isMobileView = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
    }
    return false;
};

export const columns: ColumnDef<Settlement>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="text-right">בחר</div>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                <Checkbox
                    className="flex justify-start mr-2"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "settlement_id",
        header: () => <div className="text-right">מזהה אשכול</div>,
        cell: ({ row }) => <div className="text-right">{row.getValue("settlement_id")}</div>,
        enableSorting: true,
        // Hide on mobile
        meta: {
            className: "hidden md:table-cell",
        },
    },
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
                        שם
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue("name")}</div>,
    },
]

// Mobile-specific columns that combine multiple fields
export const mobileColumns: ColumnDef<Settlement>[] = [
    {
        id: 'mobile-view',
        header: () => <div className="text-right pr-2">בחר ישוב</div>,
        // Add accessorFn to explicitly define where to get the data
        accessorFn: (row) => ({
            name: row.name,
            settlement_id: row.settlement_id
        }),
        cell: ({ row }) => {
            // Get the original row data
            const data = row.original;
            
            return (
                <div className="flex items-center justify-between p-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                    <div className="text-right flex-1 mr-4">
                        <div className="font-medium">{data.name}</div>
                        <div className="text-sm text-muted-foreground">מזהה: {data.settlement_id}</div>
                    </div>
                </div>
            );
        },
    },
]