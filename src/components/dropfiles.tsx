"use client"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, FileSpreadsheet, FileIcon, X } from "lucide-react"
import { Button } from "./ui/button";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

const maxFileSize = 5 * 1024 * 1024; // 5 MB

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]


export default function DropUpload({project_id}: {project_id: number}) {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter();
  const toast = useToast();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter((file) => allowedFileTypes.includes(file.type))
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: maxFileSize
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6 text-red-500" />
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    return <FileIcon className="h-6 w-6 text-blue-500" />
  }
  const handleUpload = async () => {
        if (files.length !== 1) {
            alert("Sorry we currently support 1 file at the time")
            return
        }
        const singleFile = files[0];
        
        const mimeTypes = {
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xls': 'application/vnd.ms-excel',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf': 'application/pdf'
        };

        const fileExtension = singleFile.name.split('.').pop()?.toLowerCase() || '';
        const correctMimeType = mimeTypes[fileExtension as keyof typeof mimeTypes] || singleFile.type;

        if (!allowedFileTypes.includes(correctMimeType)) {
        alert("Invalid file type. Only PDF, Excel, and Word files are allowed.");
        return;
        }

        if (singleFile.size > maxFileSize) {
        alert("File size exceeds the 5 MB limit.");
        return;
        }

        try {
        const fileReader = new FileReader();
        const fileContentPromise = new Promise<string>((resolve, reject) => {
            fileReader.onload = () => {
            const result = fileReader.result;
            if (typeof result === 'string') {
                resolve(result);
            } else {
                reject(new Error('Failed to read file as base64'));
            }
            };
            fileReader.onerror = () => reject(fileReader.error);
            fileReader.readAsDataURL(singleFile);
        });

        const fileContent = await fileContentPromise;

        const response = await fetch("/api/storage", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            project_id: project_id,
            fileName: singleFile.name,
            fileContent: fileContent,
            fileType: correctMimeType,
            fileSize: singleFile.size,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Upload failed");
        }
        // alert("Upload complete!")
        toast.success('קובץ נעלה בהצלחה', 'קובץ נעלה בהצלחה', 3000);
        setFiles([])
        router.refresh();
        } catch (error) {
            if(error instanceof Error) {
                toast.error('שגיאה בעלאת קובץ', error.message, 3000);
            }
            else {
                toast.error('שגיאה בעלאת קובץ', 'שגיאה בעלאת קובץ', 3000);
            }
        }
    }
    return (
    <div className="max-w-md mx-auto flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? "שחרר את הקובץ כאן ..." : " גרור ושחרר קובץ כאן, או לחצו כדי לבחור קובץ"}
          <br/> ניתן להעלות רק קבצים מסוג pdf, xls, xlsx, doc, docx
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <div className="flex items-center space-x-2">
                {getFileIcon(file.type)}
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <button 
                onClick={() => removeFile(index)} 
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Button className=" max-w-md" onClick={handleUpload}>העלאת קובץ</Button>
    </div>
  )
}