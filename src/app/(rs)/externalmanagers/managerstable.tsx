'use client'
import { type ProjectManager, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { DebouncedInput } from '@/components/debounced-input';
import { useState } from 'react';
import { AddManagerDialog } from './manager-dialog';
import { useRouter } from 'next/navigation';

interface PostProjectManagerInput {
    full_name: string;
    company_name?: string;
    position?: string;
    email?: string;
    phone?: string;
    is_external: boolean;
}

export async function PostProjectManager(
    data: PostProjectManagerInput
): Promise<ProjectManager> {
    const response = await fetch(`/api/project-managers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project manager');
    }

    return response.json();
}

export default function ManagersTable({ projectManagers }: { projectManagers: ProjectManager[] }) {
    const router = useRouter();
    const [selected, setSelected] = useState<ProjectManager | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSubmit = async (data: ProjectManager) => {
        try {
            await PostProjectManager({
                full_name: data.full_name,
                company_name: data.company_name,
                position: data.position,
                email: data.email,
                phone: data.phone,
                is_external: data.is_external || true,
            });
            router.refresh();
        } catch (error) {
            console.error('Error creating project manager:', error);
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
                        value={searchTerm ?? ''}
                        onChange={value => setSearchTerm(String(value))}
                        className="p-2 font-lg shadow border border-block"
                        placeholder={"חפש מנהל פרויקט"}
                    />
                    <AddManagerDialog
                        onSubmit={handleSubmit}
                        onClose={handleClose}
                    />
                </div>
                <DataTable 
                    label={'מנהלי פרויקטים'} 
                    columns={columns} 
                    data={projectManagers} 
                    setSelected={setSelected} 
                    setGlobalSerc={setSearchTerm}
                    GlobalSerc={searchTerm}
                />
            </div>
        </>
    )
}