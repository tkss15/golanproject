import { db } from '@/db'
import { projectFiles } from '@/db/schema'
// import { eq } from 'drizzle-orm'

export type NewProjectFile = {
    project_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    file_original_path?: string;
    uploaded_by: number;
    description?: string;
}

function validateFileData(fileData: NewProjectFile) {
    if (!fileData.project_id) throw new Error('Project ID is required');
    if (!fileData.file_name) throw new Error('File name is required');
    if (!fileData.file_path) throw new Error('File path is required');
    if (!fileData.file_size || fileData.file_size <= 0) throw new Error('Valid file size is required');
    if (!fileData.file_type) throw new Error('File type is required');
    if (!fileData.uploaded_by) throw new Error('Uploader ID is required');
}


export async function insertProjectFile(fileData: NewProjectFile) {
    validateFileData(fileData);
    
    try {
        const newFile = await db.insert(projectFiles)
            .values({
                project_id: fileData.project_id,
                file_name: fileData.file_name,
                file_path: fileData.file_path,
                file_size: fileData.file_size,
                file_type: fileData.file_type,
                uploaded_by: fileData.uploaded_by,
                description: fileData.description,
                upload_date: new Date(),
                is_active: true
            })
            .returning({
                id: projectFiles.id,
                file_name: projectFiles.file_name,
                file_path: projectFiles.file_path,
                upload_date: projectFiles.upload_date
            });

        return newFile[0];
    } catch (error) {
        throw new Error(`Failed to insert file: ${error.message}`);
    }
}