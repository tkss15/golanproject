"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AddFundingDialog } from "./funding-dialog"

// Define the User type
export type fundingSources = {
    id: string
    source_name: string
    source_type: string
    contact_details: string
}
interface UpdateFundingSourceInput {
    source_name?: string;
    source_type?: string;
    contact_details?: string;
}
export async function updateFundingSource(
    id: string, 
    data: UpdateFundingSourceInput
  ): Promise<fundingSources> {
    const response = await fetch(`/api/funding-sources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update funding source');
    }
  
    return response.json();
  }

// Define columns
export const columns: ColumnDef<fundingSources>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        מזהה מימון
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="hidden md:flex justify-start">
                {row.getValue("id")}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "source_name",
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
        cell: ({ row }) => (
            <div className="text-right font-semibold">
                {row.getValue("source_name")}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "source_type",
        header: () => <div className="text-right">סוג מימון</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.source_type}
            </div>
        ),
    },
    {
        accessorKey: "contact_details",
        header: () => <div className="text-right">פרטי קשר</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.contact_details}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
            accessorKey: "actions",
            enableHiding: false,
            header: () => <div className="text-right">פעולות</div>,
            cell: ({ row }) => {
              const router = useRouter();
              const [showEditDialog, setShowEditDialog] = useState(false);
              const [dropdownOpen, setDropdownOpen] = useState(false);

              const handleEdit = async (data: FundingSource) => {
                try {
                  // Your API call here
                  await updateFundingSource(row.original.id,data);
                  setShowEditDialog(false);
                   router.refresh();
                  // Refresh your table data here
                } catch (error) {
                  console.error('Error updating funding source:', error);
                }
              }
          
              const handleEditClick = (e: React.MouseEvent) => {
                e.stopPropagation(); // Prevent event bubbling
                setShowEditDialog(true);
                setDropdownOpen(false); // Close dropdown when opening dialog
              }
          
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">פעולות</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-right">פעולות</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/projects?funder_id=${row.original.id}`);
                        }}
                      >
                        פרוייקטים במימון זה
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex-row-reverse"
                        onClick={handleEditClick}
                      >
                        ערוך פרטים
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex-row-reverse text-red-500">
                        מחיקה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
          
                  {showEditDialog && (
                    <AddFundingDialog
                      initialData={row.original}
                      onSubmit={handleEdit}
                      onClose={() => setShowEditDialog(false)}
                      open={showEditDialog}
                      onOpenChange={setShowEditDialog}
                    />
                  )}
                </div>
              )
            },
        filterFn: 'includesString',
    },
]
