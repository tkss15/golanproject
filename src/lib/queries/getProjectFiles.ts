import { db } from '@/db'
import { projectFiles, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { 
    BlobServiceClient, 
    StorageSharedKeyCredential, 
    generateBlobSASQueryParameters,
    BlobSASPermissions 
} from '@azure/storage-blob'

export async function getFilesByProject(project_id: string, tx?: any) {
    if (!project_id) {
        throw new Error('Department ID is required')
    }

    const projectsArr = await (tx || db)
        .select({
            file_name: projectFiles.file_name,
            file_size: projectFiles.file_size,
            file_path: projectFiles.file_path,
            file_content: projectFiles.file_type,
            uploaded_by_fn: users.first_name,
            uploaded_by_ln: users.last_name,
            uploaded_date: projectFiles.upload_date,
        })
        .from(projectFiles)
        .where(eq(projectFiles.project_id, project_id)) // Filter by department
        .leftJoin(users, eq(projectFiles.uploaded_by, users.id))

        // יצירת טוקן SAS לכל קובץ
    const filesWithSasTokens = await Promise.all(
        projectsArr.map(async (file) => {
            const sasUrl = await generateSasToken(file);
            return {
                ...file,
                file_url: sasUrl
            };
        })
    );
        
    return filesWithSasTokens;
    // files returning needs to be a sas link 

    // //  create file path with 
    // return projectsArr
}

async function generateSasToken(file: any): Promise<string> {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!connectionString || !containerName) {
        throw new Error('Azure storage credentials are missing');
    }
    const blobPath = file.file_path;
    // ניקוי הנתיב מ-URL מלא אם קיים
    const cleanBlobPath = blobPath.replace(/^https?:\/\/[^\/]+\/[^\/]+\//, '');
    // My edit
    const index = cleanBlobPath.indexOf('/');
    const subPath = cleanBlobPath.substring(0, index+1);
    const totalPath = subPath + file.file_name;

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(totalPath);
    console.log(cleanBlobPath);

    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + 3600 * 1000);

    // יצירת טוקן SAS עם הגדרות מפורטות יותר
    const sasOptions = {
        containerName,
        blobName: totalPath,
        permissions: BlobSASPermissions.parse("r"),
        startsOn,
        expiresOn,
        protocol: "https",
        contentDisposition: "inline",
        contentType: "application/octet-stream"
    };

    const sasToken = await generateBlobSASQueryParameters(
        sasOptions,
        blobServiceClient.credential as StorageSharedKeyCredential
    ).toString();

    // החזרת ה-URL המלא עם הטוקן
    return `${blobClient.url}?${sasToken}`;
}