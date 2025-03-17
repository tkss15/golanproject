'use client'
import { type Department, columns } from './columns'
import { DataTable } from "@/components/data-table";
import { DebouncedInput } from '@/components/debounced-input';
import { useState } from 'react';
import { AddDepartmentDialog } from './department-dialog';
import { useRouter } from 'next/navigation';

interface PostDepartmentInput {
    department_name: string;
    project_type: string;
}

export async function PostDepartment(
    data: PostDepartmentInput
): Promise<Department> {
    const response = await fetch(`/api/departments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create department');
    }

    return response.json();
}

export default function DepartmentsTable({ arrDepartments }: { arrDepartments: Department[] }) {
    const router = useRouter();
    const [selected, setSelected] = useState<Department | null>(null);
    const [departmentSearch, setDepartmentSearch] = useState<string>('');

    const handleSubmit = async (data: Department) => {
        try {
            await PostDepartment(data);
            router.refresh();
        } catch (error) {
            console.error('Error creating department:', error);
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
                        value={departmentSearch ?? ''}
                        onChange={value => setDepartmentSearch(String(value))}
                        className="p-2 font-lg shadow border border-block"
                        placeholder={"חפש מחלקה"}
                    />
                    <AddDepartmentDialog
                        onSubmit={handleSubmit}
                        onClose={handleClose}
                    />
                </div>
                <DataTable 
                    label={'מחלקות'} 
                    columns={columns} 
                    data={arrDepartments} 
                    setSelected={setSelected} 
                    setGlobalSerc={setDepartmentSearch}
                    GlobalSerc={departmentSearch}
                />
            </div>
        </>
    )
}