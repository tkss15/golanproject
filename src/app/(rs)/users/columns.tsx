"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Edit } from "lucide-react"
import { useState } from "react"
import { DeleteUserDialog } from "@/components/delete-dialog"
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import { AddUserDialog } from "./add-user-dialog"

// Define the User type
export type User = {
    id: number
    kinde_id: string
    email: string
    picture: string
    username: string
    full_name: string
    last_name: string
    first_name: string
    role: string
}

// Define columns
export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "picture",
        header: () => <div className="text-right">אוואטר</div>,
        cell: ({ row }) => (
            <div className="flex justify-start items-center gap-4">
                <Avatar>
                    <AvatarImage src={row.original.picture} />
                    <AvatarFallback>{row.original.first_name.charAt(0).toUpperCase() + row.original.last_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="block md:hidden font-bold">
                    {row.original.first_name} {row.original.last_name}
                </div>
            </div>
        ),
        filterFn: 'includesString',
    },    {
        accessorKey: "first_name",
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
            <div className="text-right font-semibold hidden md:block">
                {row.original.first_name} {row.original.last_name}
            </div>
        ),
        filterFn: 'includesString',
    },
    {
        accessorKey: "email",
        header: () => <div className="text-right">אימייל</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.email}
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: () => <div className="text-right">תפקיד</div>,
        cell: ({ row }) => (
            <div className="text-right text-sm text-gray-500">
                {row.original.role}
            </div>
        ),
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-right">פעולות</div>,
        cell: ({ row }) => {
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const [showEditDialog, setShowEditDialog] = useState(false);
            const {user} = useKindeBrowserClient();

            const handleUpdateUser = async (data: { given_name: string; family_name: string; role: string; email: string }) => {
              const endpoint = 'http://localhost:3000/api/users/' + row.original.kinde_id
              const payload = {
                given_name: data.given_name,
                family_name: data.family_name,
                role: data.role,
                email: data.email,
              }
              const resposnse = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              })
            }
            const handleDeleteClick = (e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent event bubbling
              setShowDeleteDialog(true);
              setDropdownOpen(false); // Close dropdown when opening dialog
            }

            const handleEditClick = (e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent event bubbling
              setShowEditDialog(true);
              setDropdownOpen(false); // Close dropdown when opening dialog
            }

            const handleDeleteUser = async (userKindeId: string) => {
                const endpoint = 'http://localhost:3000/api/users/' + userKindeId

                const payload = {
                  toUserKindeId: user.id
                }
                const response = await fetch(endpoint, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                })
              }
        
            return (
                <>
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
                        <DropdownMenuItem className="flex-row-reverse" onClick={handleEditClick}>
                        ערוך פרטים
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex-row-reverse text-red-500" onClick={handleDeleteClick}>
                        מחיקה
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {showEditDialog && <AddUserDialog 
                    initialData={{
                        id: row.original.id,
                        given_name: row.original.first_name,
                        family_name: row.original.last_name,
                        role: row.original.role,
                        email: row.original.email,
                    }}
                    onSubmit={handleUpdateUser}
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog} />}
                {showDeleteDialog && <DeleteUserDialog 
                    userName={row.original.first_name + " " + row.original.last_name} 
                    userEmail={row.original.email}
                    onDelete={() => handleDeleteUser(row.original.kinde_id)} 
                    open={showDeleteDialog} 
                    onOpenChange={setShowDeleteDialog} />}
                </>
            )
          },
        filterFn: 'includesString',
    },
]
