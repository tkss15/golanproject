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
import { AddManagerDialog } from "./manager-dialog"
import { Badge } from "@/components/ui/badge"

// Define the ProjectManager type
export type ProjectManager = {
    id: string
    full_name: string
    company_name: string
    position: string
    email: string
    phone: string
    is_external: boolean
    user_id?: string
    created_at: string
    updated_at: string
    is_active: boolean
}

interface UpdateProjectManagerInput {
    full_name?: string
    company_name?: string
    position?: string
    email?: string
    phone?: string
    is_external?: boolean
    is_active?: boolean
}

export async function updateProjectManager(
    id: string, 
    data: UpdateProjectManagerInput
): Promise<ProjectManager> {
    const response = await fetch(`/api/project-managers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project manager');
    }

    return response.json();
}

// Define columns
export const columns: ColumnDef<ProjectManager>[] = [
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
                        מזהה
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
        accessorKey: "full_name",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                        שם מלא
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="text-right font-semibold">
                {row.getValue("full_name")}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "company_name",
        header: () => <div className="text-right">חברה</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm">
                {row.original.company_name || "-"}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "position",
        header: () => <div className="text-right">תפקיד</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm">
                {row.original.position || "-"}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "is_external",
        header: () => <div className="text-right">סוג</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <Badge variant={row.original.is_external ? "outline" : "default"}>
                    {row.original.is_external ? "חיצוני" : "פנימי"}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: () => <div className="text-right">אימייל</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.email || "-"}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "phone",
        header: () => <div className="text-right">טלפון</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.phone || "-"}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "is_active",
        header: () => <div className="text-right">סטטוס</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <Badge variant={row.original.is_active ? "success" : "destructive"}>
                    {row.original.is_active ? "פעיל" : "לא פעיל"}
                </Badge>
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

            const handleEdit = async (data: ProjectManager) => {
                try {
                    await updateProjectManager(row.original.id, data);
                    setShowEditDialog(false);
                    router.refresh();
                } catch (error) {
                    console.error('Error updating project manager:', error);
                }
            }

            const handleEditClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                setShowEditDialog(true);
                setDropdownOpen(false);
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
                                    router.push(`/projects?manager_id=${row.original.id}`);
                                }}
                            >
                                פרוייקטים בניהול
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="flex-row-reverse"
                                onClick={handleEditClick}
                            >
                                ערוך פרטים
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="flex-row-reverse text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle deactivation instead of deletion
                                    updateProjectManager(row.original.id, { is_active: false })
                                        .then(() => router.refresh())
                                        .catch(err => console.error('Error deactivating manager:', err));
                                }}
                            >
                                {row.original.is_active ? "השבת מנהל" : "הפעל מנהל"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {showEditDialog && (
                        <AddManagerDialog
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