import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">פרויקטים</h1>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="ml-2 h-4 w-4" /> הוסף פרויקט חדש
      </Button>
    </header>
  )
}

