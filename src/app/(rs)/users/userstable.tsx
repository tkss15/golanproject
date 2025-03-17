'use client'

import { useState } from 'react'
import { User, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { AddUserDialog } from './add-user-dialog'
import { useRouter } from 'next/navigation'
import { DebouncedInput } from '@/components/debounced-input';
import { Button } from '@/components/ui/button';

interface UsersTableProps {
  users: User[]
  id: string
  nextToken: string | null
  prevToken: string | null
  totalRows: number
  role: 'admin' | 'manager' | 'viewer' | 'user' | null
}

export default function UsersTable({
  users,
  id,
  role,
}: UsersTableProps) {
  const router = useRouter()
  const [searchUser, setSearchUser] = useState<string>('')
  const [selected, setSelected] = useState<User | null>(null)
  const filteredUsers = users.filter(user => user.id !== 99)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Handler for adding a new user
  const handleAddUser = async (data: { given_name: string; family_name: string; role: string; email: string }) => {
    const endpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/users`
    // Build the payload; adjust as needed for your API.
    const payload = {
      id: id,
      profile: {
        given_name: data.given_name,
        family_name: data.family_name,
      },
      identities: [
        { type: 'email', details: { email: data.email } },
      ],
      role: data.role
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Error creating user:", result.error)
        throw new Error(result.error || "Failed to create user")
      } else {
        console.log("User created successfully:", result)
        // Close dialog and refresh page
        setIsDialogOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  return (
    <div className="p-4">
      <div className='flex justify-between items-center'>
        <DebouncedInput
          value={searchUser ?? ''}
          onChange={value => setSearchUser(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder={"חפש משתמש"}
        />
        {role === 'admin' && (
          <Button onClick={() => setIsDialogOpen(true)}>
            הוסף משתמש חדש
          </Button>
        )}
      </div>

      {/* Dialog component */}
      {role === 'admin' && (
        <AddUserDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onSubmit={handleAddUser} 
        />
      )}

      {/* DataTable component using token-based pagination */}
      <DataTable 
        label={'בחר משתמש'} 
        columns={columns} 
        data={filteredUsers} 
        setSelected={setSelected} 
        setGlobalSerc={setSearchUser} 
        GlobalSerc={searchUser}
      />
    </div>
  )
}
