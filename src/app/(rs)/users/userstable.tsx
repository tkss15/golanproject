'use client'

import {useState } from 'react'
import { User, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { AddUserDialog } from './add-user-dialog'
import { useRouter } from 'next/navigation'
import { DebouncedInput } from '@/components/debounced-input';


interface UsersTableProps {
  users: User[]
  id: string
  nextToken: string | null
  prevToken: string | null
  totalRows: number
  permissions: string[]
}

export default function UsersTable({
  users,
  id,
  permissions,
}: UsersTableProps) {
  const router = useRouter()
  // State to store the currently selected user.
  const [searchUser, setSearchUser] = useState<string>('')
  const [selected, setSelected] = useState<User | null>(null)
  const filteredUsers = users.filter(user => user.id !== 99)

  // Handler for adding a new user.

  const handleAddUser = async (data: { given_name: string; family_name: string; role: string; email: string }) => {
    const endpoint = 'http://localhost:3000/api/users'
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
        // Optionally, display an error message to the user.
      } else {
        console.log("User created successfully:", result)
        router.refresh()
        // Optionally, update local state or trigger a re-fetch of your user list.
      }
    } catch (error) {
      console.error('Error creating user:', error)
      // Optionally, display a notification that an error occurred.
    }
    console.log('New user data:', data)
  }

  return (
    <div className="p-4">
      {/* Dialog to add a new user */}
      <div className='flex justify-between items-center'>
          <DebouncedInput
              value={searchUser ?? ''}
              onChange={value => setSearchUser(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder={"חפש משתמש"}
          />
          {permissions.includes('admin') && <AddUserDialog onSubmit={handleAddUser} />}
      </div>

      {/* DataTable component using token-based pagination */}
      <DataTable label={'בחר משתמש'} columns={columns} data={filteredUsers} setSelected={setSelected} setGlobalSerc={setSearchUser} GlobalSerc={searchUser}/>
    </div>
  )
}
