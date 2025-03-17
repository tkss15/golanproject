"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { AddDepartmentDialog } from "./department-dialog"
import { Badge } from "@/components/ui/badge"

// Define the Department type
export type Department = {
    id: string
    department_name: string
    project_type: string
    project_count: number
}

interface UpdateDepartmentInput {
    department_name?: string;
    project_type?: string;
}

export async function updateDepartment(
    id: string,
    data: UpdateDepartmentInput
): Promise<Department> {
    const response = await fetch(`/api/departments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update department');
    }

    return response.json();
}

// Define columns
export const columns: ColumnDef<Department>[] = [
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
                        מזהה מחלקה
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
        accessorKey: "department_name",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        שם מחלקה
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="text-right font-semibold">
                {row.getValue("department_name")}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "project_type",
        header: () => <div className="text-right">תת מחלקה</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.project_type}
            </div>
        ),
    },
    {
        accessorKey: "project_count",
        header: () => <div className="text-right">מספר פרויקטים</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <Badge variant="secondary">{row.original.project_count}</Badge>
            </div>
        ),
    },
    {
        accessorKey: "actions",
        enableHiding: false,
        header: () => <div className="text-right">פעולות</div>,
        cell: ({ row }) => {
            const router = useRouter();
            const [showEditDialog, setShowEditDialog] = useState(false);
            const [dropdownOpen, setDropdownOpen] = useState(false);

            const handleEdit = async (data: Department) => {
                try {
                    await updateDepartment(row.original.id, data);
                    setShowEditDialog(false);
                    router.refresh();
                } catch (error) {
                    console.error('Error updating department:', error);
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
                                    router.push(`/projects?department_id=${row.original.id}`);
                                }}
                            >
                                פרוייקטים במחלקה זו
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
                        <AddDepartmentDialog
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