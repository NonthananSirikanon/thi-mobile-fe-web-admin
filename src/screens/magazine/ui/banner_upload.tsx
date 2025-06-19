import { useState, useEffect } from 'react';
import { X, CloudUpload } from 'lucide-react';

interface UploadBannerProps {
  title?: string;
  required?: boolean;
  maxSize?: number;
  onFileChange?: (fileList: File[]) => void;
  supportedFormats?: string[];
  initialFile?: File | null;
}

export default function UploadBanner({
  title = "Upload Cover Image",
  required = false,
  maxSize = 10,
  onFileChange,
  supportedFormats = ['jpeg', 'jpg', 'png', 'svg'],
  initialFile = null,
  ...rest
}: UploadBannerProps & { onChange?: (fileList: File[]) => void }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(initialFile);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
  if (!initialFile) {
    setImageUrl('');
    setUploadedFile(null);
    setDimensions(null);
    return;
  }

  const url = URL.createObjectURL(initialFile);
  setImageUrl(url);
  setUploadedFile(initialFile);

  const img = new Image();
  img.onload = () => {
    setDimensions({ width: img.width, height: img.height });
  };
  img.src = url;

  return () => {
    URL.revokeObjectURL(url);
  };
}, [initialFile]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const validateFile = (file: File): boolean => {
    const isValidFormat = supportedFormats.some(format =>
      file.type === `image/${format}` ||
      (format === 'svg' && file.type === 'image/svg+xml')
    );

    if (!isValidFormat) {
      alert(`รองรับเฉพาะไฟล์ ${supportedFormats.join(', ')} เท่านั้น!`);
      return false;
    }

    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      alert(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSize}MB!`);
      return false;
    }

    return true;
  };
  
  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setUploadedFile(file);

    if (onFileChange) {
      onFileChange([file]);
    }
    if (rest.onChange) {
      rest.onChange([file]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };


  const removeFile = () => {
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
  }
  setUploadedFile(null);
  setImageUrl('');
  setDimensions(null);
  if (onFileChange) {
    onFileChange([]);
  }
};

  return (
    <div className="flex justify-center items-center p-4">
      <div className="mx-auto flex flex-col items-center"> 
        <div className="flex items-center mb-2 self-start"> 
          <p className="text-base font-medium m-0">{title}</p>
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>

        <div
          className={`h-167 w-142 relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={supportedFormats.map(format => `image/${format}`).join(',')}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />

          {uploadedFile && imageUrl ? (

            <div className="relative w-full h-full">
              <img
                src={imageUrl}
                alt={uploadedFile.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="absolute top-2 left-2 text-white text-xs space-y-1">
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                    <span className="font-medium">ชื่อไฟล์:</span> {uploadedFile.name}
                  </div>
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                    <span className="font-medium">ขนาดไฟล์:</span> {formatFileSize(uploadedFile.size)}
                  </div>
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                    <span className="font-medium">ประเภท:</span> {getFileExtension(uploadedFile.name)}
                  </div>
                  {dimensions && (
                    <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                      <span className="font-medium">ขนาดภาพ:</span> {dimensions.width} × {dimensions.height} px
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="absolute top-2 right-2 z-20 p-1 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg border border-gray-300"
                title="ลบไฟล์"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white px-3 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{uploadedFile.name}</span>
                  <div className="flex items-center space-x-3 text-xs">
                    <span>{formatFileSize(uploadedFile.size)}</span>
                    {dimensions && <span>{dimensions.width}×{dimensions.height}</span>}
                    <span>{getFileExtension(uploadedFile.name)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="text-blue-600 mb-4">
                <CloudUpload className="w-8 h-8" />
              </div>
              <p className="text-base mb-2">
                Drag your file or <span className="text-blue-600">browse</span>
              </p>
              <p className="text-gray-500 text-sm">Max {maxSize} MB files are allowed</p>
            </div>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500 self-start">
          Only {supportedFormats.join(', ')} are supported.
        </div>
      </div>
    </div>
  );
}