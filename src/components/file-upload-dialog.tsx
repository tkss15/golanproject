"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { X, FileIcon, FileSpreadsheet, FileText } from "lucide-react"

const maxFileSize = 5 * 1024 * 1024; // 5 MB

const allowedFileTypes = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export default function FileUploadDialog({ project_id, mobile } : {project_id : number, mobile?: boolean}) {
  const [files, setFiles] = useState<File[]>([])
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter((file) => allowedFileTypes.includes(file.type))
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
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

      alert("Upload complete!")
      setFiles([])
      setOpen(false)
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6 text-red-500" />
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    return <FileIcon className="h-6 w-6 text-blue-500" />
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mobile ? "outline" : "default"} className={`w-full justify-start ${mobile ? "md:hidden" : ""}`}>
            <FileText className="ml-2 h-4 w-4" />
            הוסף מסמך
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">העלאת מסמך</DialogTitle>
          <DialogDescription>העלאת קובץ PDF, XLS, או DOC. לחצו על הכפתור לבחירת קובץ.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept=".pdf,.xls,.xlsx,.doc,.docx"
          />
          <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="w-full">
            בחירת קובץ
          </Button>

          {files.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={files.length === 0}>
            העלאה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

