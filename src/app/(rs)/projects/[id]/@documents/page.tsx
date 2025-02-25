import { getFilesByProject } from "@/lib/queries/getProjectFiles";
import FileCard from "./file-card";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import FileUploadDialog from "@/components/file-upload-dialog";
import DropUpload from "@/components/dropfiles";
import { Button } from "@/components/ui/button";



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
        <Card dir="rtl" className="h-full text-right my-auto">
            <CardHeader>
                <CardTitle>
                    <h2 className="text-2xl font-bold">מסמכים</h2>



                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.length === 0 && (
                        <p className="text-center text-gray-500">אין מסמכים</p>
                    )}

                    {files.map((file) => (
                        <FileCard key={file.file_name} {...file} />
                    ))}
                </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex flex-col gap-4 ">
                    <h2 className="text-md self-center font-bold"> העלאת קובץ</h2>
                    <DropUpload project_id={parseInt(project_id)} />
            </CardFooter>
        </Card>


    )
}