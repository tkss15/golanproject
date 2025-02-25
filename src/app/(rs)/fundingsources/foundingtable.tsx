'use client'
import { type fundingSources, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { DebouncedInput } from '@/components/debounced-input';
import { useState } from 'react';
import { AddFundingDialog } from './funding-dialog';
import { useRouter } from 'next/navigation';
interface PostFundingSourceInput {
    source_name: string;
    source_type: string;
    contact_details?: string;
}

export async function PostFundingSource(
    data: PostFundingSourceInput
  ): Promise<fundingSources> {
    const response = await fetch(`/api/funding-sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update funding source');
    }
  
    return response.json();
  }

export default function UsersTable({ arrFundingSources } : {arrFundingSources : fundingSources[]}) {
    const router = useRouter();
    const [selected, setSelected] = useState<fundingSources | null>(null)
    const [funding, setFundingSearch] = useState<string>('')
    // In your parent component
    const handleSubmit = async (data: FundingSource) => {
        try {
            // Your API call here
            await PostFundingSource(data);
            // Refresh your table data here
            router.refresh();
        } catch (error) {
            console.error('Error updating funding source:', error);
        }
    }
    const handleClose = () => {
        // Handle any cleanup needed when the dialog closes
    }
    return (
        <>
            <div className='p-4'>
                <div className='flex justify-between items-center'>
                    <DebouncedInput
                        value={funding ?? ''}
                        onChange={value => setFundingSearch(String(value))}
                        className="p-2 font-lg shadow border border-block"
                        placeholder={"חפש מקור מימון"}
                    />
                    <AddFundingDialog
                      onSubmit={handleSubmit}
                      onClose={handleClose}
                    />
                </div>
                <DataTable label={'מקורות מימון'} columns={columns} data={arrFundingSources} setSelected={setSelected} setGlobalSerc={setFundingSearch}
                GlobalSerc={funding}/>
            </div>
        </>
    )
}