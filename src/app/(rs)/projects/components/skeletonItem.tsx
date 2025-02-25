
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"


export default function SkeletonItem() {
    return (                                      

      <Card 
        className={`
          mt-2 transition-all duration-300 border-primary-500 bg-blue-50 scale-105 `} 
            >
        <CardHeader>
          <CardTitle className='text-lg'><Skeleton className='w-6 h-4'/></CardTitle>
          <CardDescription>
            <Skeleton className='w-full h-4'/>
          </CardDescription>
        </CardHeader>
      </Card>
  )
}
