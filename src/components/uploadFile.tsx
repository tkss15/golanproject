'use client'
import React, { useState } from "react";

type FileUploaderProps = {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ onSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxFileSize = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) {
      onError?.("No file selected.");
      return;
    }

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      onError?.("Invalid file type. Only PDF, Excel, and Word files are allowed.");
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      onError?.("File size exceeds the 5 MB limit.");
      return;
    }

    try {
      setIsUploading(true);

      const fileContent = await file.text(); // Convert file to text for this example; for binary, use `ArrayBuffer`.

      const response = await fetch("/api/storage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        onSuccess?.(result.message || "File uploaded successfully.");
      } else {
        onError?.(result.error || "File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      onError?.("An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };  

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".pdf,.xlsx,.docx" />
      <button onClick={uploadFile} disabled={isUploading || !file}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUploader;
