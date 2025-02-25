import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="חפש פרויקטים..." className="pl-10 pr-4" />
      </div>
      <Button variant="outline" className="flex items-center">
        <Filter className="ml-2 h-4 w-4" /> סינון
      </Button>
    </div>
  )
}

