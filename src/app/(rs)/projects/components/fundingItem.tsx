
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

type fundingSourceType = {
    id: number,
    source_name: string,
    source_type: string,
    contact_details: string
}

type Props = {
    fundingSource: fundingSourceType
    selectedFunding: number
}
export default function FundingItem({fundingSource, selectedFunding} : Props) {

    return (                <Link href={{
        pathname: '/projects',
        query: { funder_id: fundingSource.id },
      }}
      >
    <Card 
      className={`
        mt-2 transition-all duration-300 
        ${selectedFunding === fundingSource.id 
          ? 'border-primary-500 bg-blue-50 scale-100' 
          : 'hover:bg-gray-100 hover:shadow-md'}
          `} 
          >
      <CardHeader>
        <CardTitle className='text-lg'>{fundingSource.source_name}</CardTitle>
        <CardDescription>
            סוג תורם: {fundingSource.source_type}
            <p>
              פרטי התקשרות: {fundingSource.contact_details ?? "אין פרטים"}
            </p>
        </CardDescription>
      </CardHeader>
    </Card>
  </Link> 
  )
}
