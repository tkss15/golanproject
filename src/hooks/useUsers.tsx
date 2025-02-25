import { useState, useEffect } from 'react'
import { User } from '@/zod-schemas/users'


const API_PAGE_SIZE = 10

export function useUsers(search: string) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  // Encapsulate the fetch logic
  const fetchUsers = async (currentOffset: number) => {
    try {
      const response = await fetch(
        `/api/users?page_size=${API_PAGE_SIZE}&offset=${currentOffset}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const fetchedUsers = await response.json()
      return fetchedUsers
    } catch (error) {
      console.error('Failed to fetch users:', error)
      throw error
    }
  }

  // Initial load
  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers(0)
        setUsers(fetchedUsers)
        setHasMore(fetchedUsers.length === API_PAGE_SIZE)
      } catch (error) {
        // Error already logged in fetchUsers
      } finally {
        setLoading(false)
      }
    }

    loadInitialUsers()
  }, [])

  // Filter users based on search
  const filteredUsers = users.filter((user: User) => {
    const searchLower = search.toLowerCase()
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const loadMore = async () => {
    try {
      setLoading(true)
      const newOffset = offset + API_PAGE_SIZE
      const fetchedUsers = await fetchUsers(newOffset)
      setUsers(prev => [...prev, ...fetchedUsers])
      setOffset(newOffset)
      setHasMore(fetchedUsers.length === API_PAGE_SIZE)
    } catch (error) {
      // Error already logged in fetchUsers
    } finally {
      setLoading(false)
    }
  }

  return { users: filteredUsers, loading, hasMore, loadMore }
}