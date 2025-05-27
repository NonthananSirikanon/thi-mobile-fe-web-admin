import { useState } from 'react';
import { Upload, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';

interface UploadBannerProps {
  title?: string;
  required?: boolean;
  maxSize?: number;
  onFileChange?: (fileList: UploadFile[]) => void;
  supportedFormats?: string[];
}

export default function UploadBanner({
  title = "Upload banner",
  required = false,
  maxSize = 10,
  onFileChange,
  supportedFormats = ['jpeg', 'jpg', 'png', 'svg']
}: UploadBannerProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file: File) => {
    const isValidFormat = supportedFormats.some(format =>
      file.type === `image/${format}` ||
      (format === 'svg' && file.type === 'image/svg+xml')
    );

    if (!isValidFormat) {
      message.error(`Only ${supportedFormats.join(', ')} are supported!`);
      return Upload.LIST_IGNORE;
    }

    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      message.error(`File must be smaller than ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (onFileChange) {
      onFileChange(newFileList);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-2">
        <p className="text-base font-medium m-0">{title}</p>
        {required && <span className="text-red-500 ml-1">*</span>}
      </div>

      <div className="h-full">
        <Upload.Dragger
          listType="picture"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          multiple={false}
          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        >
          <div className="h-full p-3 flex flex-col items-center justify-center">
            <div className="text-blue-600 mb-4">
              <CloudUploadOutlined className="text-3xl" />
            </div>
            <p className="text-base mb-2">Drag your file or <span className="text-blue-600">browse</span></p>
            <p className="text-gray-500 text-sm">Max {maxSize} MB files are allowed</p>
          </div>
        </Upload.Dragger>
      </div>

      
    </div>
  );
}