import type { FC } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileIcon, FileSpreadsheet, FileText } from "lucide-react"

interface FileCardProps {
    file_name: string;
    file_size: number;
    file_path: string;
    file_content: string;
    uploaded_by_fn: string | null;
    uploaded_by_ln: string | null;
    uploaded_date: Date | null;
    file_url: string;
}



const FileCard: FC<FileCardProps> = ({ file_name, file_content, file_size, file_path, file_url }) => {
  const getFileIcon = () => {
    if (file_content.includes("pdf")) return <FileText className="h-12 w-12 text-red-500" />
    if (file_content.includes("excel") || file_content.includes("sheet"))
      return <FileSpreadsheet className="h-12 w-12 text-green-500" />
    return <FileIcon className="h-12 w-12 text-blue-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Card className="w-full col-span-1">
      <CardContent className="pt-6 flex flex-col items-center">
        {getFileIcon()}
        <h3 className="mt-2 font-semibold text-sm truncate w-full text-center">{file_name}</h3>
        <p className="text-sm text-gray-500">{formatFileSize(file_size)}</p>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 justify-center">
        <Button asChild variant="outline">
          <a href={file_url} download={file_name} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FileCard

