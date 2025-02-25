import { projectFiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { db } from '@/db'

export async function deleteFileByURL(fileURL: string, tx?: any) {
  const fileToDelete = await (tx || db)
  .delete(projectFiles)
  .where(eq(projectFiles.file_path, fileURL))
  .execute()
  return fileToDelete
}



export async function deleteFile(fileID: number, tx?: any) {
  const fileToDelete = await (tx || db)
  .delete(projectFiles)
  .where(eq(projectFiles.id, fileID))
  .execute()
  return fileToDelete
}
