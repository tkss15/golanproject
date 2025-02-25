import { NextRequest, NextResponse } from "next/server";
import { 
  StorageSharedKeyCredential, 
  generateBlobSASQueryParameters,
  BlobSASPermissions 
} from "@azure/storage-blob";
import { getFilesByProject } from "@/lib/queries/getProjectFiles";

// קבועים זהים לאלה שב-storage/route.ts
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || "golanproject";

// יצירת credentials
const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
  process.env.AZURE_ACCOUNT_KEY || ""
);

// יצירת BlobServiceClient

export async function GET(req: NextRequest) {
  try {
    // במקום לנסות לקרוא JSON, נשתמש בפרמטרים מה-URL
    const { searchParams } = new URL(req.url);
    const project_id = searchParams.get('project_id');

    if (!project_id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const files = await getFilesByProject(project_id);
    
    // יצירת URL מלא עם SAS token לכל קובץ
    const filesWithUrls = files.map(file => {
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName: CONTAINER_NAME,
          blobName: file.file_path, // משתמשים בנתיב המלא של הקובץ
          permissions: BlobSASPermissions.parse("r"),
          startsOn: new Date(),
          expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // תוקף לשעה
          contentType: file.file_content,
          contentDisposition: `attachment; filename="${encodeURIComponent(file.file_name)}"`,
        },
        sharedKeyCredential
      ).toString();

      // בניית URL מלא עם SAS token
      return {
        ...file,
        file_path: `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER_NAME}/${file.file_path}?${sasToken}`
      };
    });

    return NextResponse.json(filesWithUrls);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
} 