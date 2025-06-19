import { useEffect, useState } from "react";
import { X, CloudUpload } from "lucide-react";

interface UploadBannerProps {
  id?: string;
  name?: string;
  title?: string;
  required?: boolean;
  maxSize?: number;
  onFileChange?: (fileList: File[]) => void;
  supportedFormats?: string[];
  defaultPreview?: string;
  existingImageUrl?: string;
  initialFiles?: File[];
}

export default function UploadBanner({
  id,
  name,
  title = "Upload banner",
  required = false,
  maxSize = 10,
  onFileChange,
  initialFiles = [],

  supportedFormats = ["jpeg", "jpg", "png", "svg"],
}: UploadBannerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ error state
  const [errorMessage, setErrorMessage] = useState<string>("");


  useEffect(() => {
    if (initialFiles.length > 0) {
      const file = initialFiles[0];
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setImageUrl(url);
    }
  }, [initialFiles]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  useEffect(() => {
    if (initialFile && !uploadedFile) {
      setUploadedFile(initialFile);
      const url = URL.createObjectURL(initialFile);
      setImageUrl(url);

      if (initialFile.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = url;
      }
    }
  }, [initialFile, uploadedFile]);
  const validateFile = (file: File): boolean => {
    const isValidFormat = supportedFormats.some(
      (format) =>
        file.type === `image/${format}` ||
        (format === "svg" && file.type === "image/svg+xml")
    );

    if (!isValidFormat) {
      setErrorMessage(
        `รองรับเฉพาะไฟล์ ${supportedFormats.join(", ")} เท่านั้น`
      );
      return false;
    }

    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      setErrorMessage(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSize}MB`);
      return false;
    }

    setErrorMessage("");
    return true;
  };


  const handleFile = (file: File) => {
    if (!validateFile(file)) return;


    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setUploadedFile(file);

    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    }

    if (onFileChange) {
      onFileChange([file]);
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
    setImageUrl("");
    setDimensions(null);
    setError(null); // ✅ clear error
    if (onFileChange) {
      onFileChange([]);
    }
  };


  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <p className="text-base font-medium m-0">{title}</p>
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-colors ${errorMessage
          ? "border-red-500 bg-red-50"
          : dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={id}
          name={name}
          type="file"
          accept={supportedFormats.map((format) => `image/${format}`).join(",")}

          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {uploadedFile && imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt={uploadedFile.name}
              className="w-full h-64 object-cover"
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-2 left-2 text-white text-xs space-y-1">
                <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                  <span className="font-medium">ชื่อไฟล์:</span>{" "}
                  {uploadedFile.name}
                </div>
                <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                  <span className="font-medium">ขนาดไฟล์:</span>{" "}
                  {formatFileSize(uploadedFile.size)}
                </div>
                <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                  <span className="font-medium">ประเภท:</span>{" "}
                  {getFileExtension(uploadedFile.name)}
                </div>
                {dimensions && (
                  <div className="bg-black bg-opacity-60 px-2 py-1 rounded">
                    <span className="font-medium">ขนาดภาพ:</span>{" "}
                    {dimensions.width} × {dimensions.height} px
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
                <span className="truncate flex-1 mr-2">
                  {uploadedFile.name}
                </span>
                <div className="flex items-center space-x-3 text-xs">
                  <span>{formatFileSize(uploadedFile.size)}</span>
                  {dimensions && (
                    <span>
                      {dimensions.width}×{dimensions.height}
                    </span>
                  )}
                  <span>{getFileExtension(uploadedFile.name)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className={`mb-4 ${error ? "text-red-500" : "text-blue-600"}`}>
              <CloudUpload className="w-8 h-8" />
            </div>
            <p className="text-base mb-2">
              Drag your file or{" "}
              <span className={`${error ? "text-red-500" : "text-blue-600"}`}>
                browse
              </span>
            </p>
            <p className="text-gray-500 text-sm">
              Max {maxSize} MB files are allowed
            </p>
          </div>
        )}
      </div>


      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      <div
        className={`mt-2 text-sm ${errorMessage ? "text-red-500" : "text-gray-500"
          }`}
      >
        {errorMessage ||
          `Only ${supportedFormats.join(", ")} are supported.`}
      </div>
    </div>
  );
}
