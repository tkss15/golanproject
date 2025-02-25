import { getFilesByProject } from "@/lib/queries/getProjectFiles";
import FileCard from "./file-card";
// import { getAllUsersProject } from "@/lib/queries/getAllUsersProject";
// import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";


export default async function ProjectHeader({
    params,
  }: {
    params: { id?: string };
  }) {
    const { id:project_id } = await params;
    if(!project_id)
        return <p>Waiting for ID</p>
        
    const files = await getFilesByProject(project_id);
    // // if (!searchParams.project_id) return null
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <FileCard key={file.file_name} {...file} />
        ))}
      </div>
    )
}


// Usage example