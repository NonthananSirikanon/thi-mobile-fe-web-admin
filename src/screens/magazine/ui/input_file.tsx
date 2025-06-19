import React, { useEffect, useState } from 'react';
import '../magazine.css';

interface FileUploaderProps {
  onFileSelectBase64?: (base64: string) => void;
  initialFileName?: string;
  initialBase64?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelectBase64, initialFileName, initialBase64 }) => {
  const [fileName, setFileName] = useState(initialFileName || 'No file selected');
  const [base64File, setBase64File] = useState(initialBase64 || '');

  useEffect(() => {
  if (initialFileName) {
    setFileName(initialFileName);
  }
}, [initialFileName]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        setFileName('No file selected');
        return;
      }

      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setBase64File(base64);
        onFileSelectBase64?.(base64);
      };
      reader.onerror = () => {
        alert('Failed to read the file.');
      };
      reader.readAsDataURL(file); 
    } else {
      setFileName('No file selected');
    }
  };

  return (
    <div className="w-full space-y-1">
      <div className="text-md font-medium text-gray-700 mb-2">Magazine File (PDF)</div>
      <div className="file-upload-container">
        <label htmlFor="fileInput" className="custom-file-label">
          Select File
        </label>
        <input
          type="file"
          id="fileInput"
          accept="application/pdf" 
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="file-name flex-1">{fileName}</span>
      </div>
    </div>
  );
};

export default FileUploader;
