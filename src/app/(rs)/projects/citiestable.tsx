'use client'
import { Settlement, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DebouncedInput } from '@/components/debounced-input';
export default function CitiesTable({ settlements } : {settlements : Settlement[]}) {
    const [selected, setSelected] = useState<Settlement | null>(null)
    const [searchCity, setSearchCity] = useState<string>('')
    const router = useRouter();
    const handleClick = () => {
        if (selected) {
            router.push(`/cities/form/?settlement_id=${selected.settlement_id}`)
        }
    }
    return (
        <>
            <div>
                <DebouncedInput
                value={searchCity ?? ''}
                onChange={value => setSearchCity(String(value))}
                className="p-2 font-lg shadow border border-block"
                placeholder={"חפש ישוב"}
            />
            </div>
            <div className='p-4'>
                <DataTable label={'בחר ישוב'} columns={columns} data={settlements} setSelected={setSelected} setGlobalSerc={setSearchCity} GlobalSerc={searchCity}/>
                <Button disabled={selected === null} onClick={handleClick} className='w-min mr-auto mt-3 ml-5'>
                    בחר
                </Button>

            </div>
        </>
    )
}