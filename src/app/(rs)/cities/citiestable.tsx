'use client'

import { Settlement, columns, mobileColumns } from './columns'
import { DataTable } from "@/components/data-table";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DebouncedInput } from '@/components/debounced-input';

export default function CitiesTable({ settlements }: { settlements: Settlement[] }) {
    const [selected, setSelected] = useState<Settlement | null>(null)
    const router = useRouter();
    const [searchCity, setSearchCity] = useState<string>('')
    const [isMobile, setIsMobile] = useState(false)
    
    // Detect mobile view on client side
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        // Initial check
        checkMobile()
        
        // Add event listener for resize
        window.addEventListener('resize', checkMobile)
        
        // Cleanup
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    const handleClick = () => {
        if (selected) {
            router.push(`/cities/form/?settlement_id=${selected.settlement_id}`)
        }
    }
    
    return (
        <div className="flex flex-col space-y-4 w-full">
            {/* Search bar */}
            <div className="w-full flex justify-end md:justify-start px-2">
                <div className={isMobile ? "w-full" : "w-full max-w-md"}>
                    <DebouncedInput
                        value={searchCity ?? ''}
                        onChange={value => setSearchCity(String(value))}
                        className="w-full p-2 text-base shadow rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="חפש ישוב"
                        dir="rtl"
                    />
                </div>
            </div>
            
            {/* Table container */}
            <div className="w-full overflow-hidden rounded-lg">
                <DataTable 
                    label='בחר ישוב' 
                    columns={isMobile ? mobileColumns : columns} 
                    data={settlements} 
                    setSelected={setSelected} 
                    setGlobalSerc={setSearchCity} 
                    GlobalSerc={searchCity}
                />
                
                {/* Button container */}
                <div className="flex justify-start mt-4 mb-2 px-4">
                    <Button 
                        disabled={selected === null} 
                        onClick={handleClick} 
                        className={`px-6 py-2 ${isMobile ? 'w-full' : ''}`}
                    >
                        בחר
                    </Button>
                </div>
            </div>
        </div>
    )
}