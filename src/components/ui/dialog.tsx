// components/UniversalDialog.tsx
import React from 'react';
import { Modal, Button, Carousel } from 'antd';
import { AntTable, type TableModel } from './table';

interface BaseDialogProps {
  visible: boolean;
  onCancel: () => void;
}

interface ConfirmDialogProps extends BaseDialogProps {
  type: 'confirm';
  title?: string;
  description?: string;
  onConfirm: () => void;
}

interface DeleteDialogProps extends BaseDialogProps {
  type: 'delete';
  imageUrl?: string;
  onDelete: () => void;
}

interface PreviewBannerDialogProps extends BaseDialogProps {
  type: 'previewBanner';
  bannerImages: string[]; 
}

interface PublishDialogProps extends BaseDialogProps {
  type: 'publish';
  onConfirm: () => void;
  tableData: TableModel;
}

type UniversalDialogProps =
  | ConfirmDialogProps
  | DeleteDialogProps
  | PreviewBannerDialogProps
  | PublishDialogProps;

const UniversalDialog: React.FC<UniversalDialogProps> = (props) => {
  const { visible, onCancel } = props;

  const renderContent = () => {
    switch (props.type) {
      case 'confirm':
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">
              {props.title || 'Add Item Confirmation'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {props.description ||
                'Are you sure you want to add this item? Please ensure all details are correct.'}
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" onClick={props.onConfirm}>
                Confirm
              </Button>
            </div>
          </>
        );

      case 'delete':
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">Delete Confirmation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to permanently delete this item? This action cannot be undone.
            </p>
            {props.imageUrl && (
              <img
                src={props.imageUrl}
                alt="Preview"
                className="w-full max-h-40 object-contain mb-4 rounded-md border"
              />
            )}
            <div className="flex justify-center gap-4">
              <Button onClick={onCancel} className="border-red-500 text-red-500 hover:bg-red-50">
                Cancel
              </Button>
              <Button type="primary" danger onClick={props.onDelete}>
                Delete
              </Button>
            </div>
          </>
        );

      case 'previewBanner':
        return (
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-4 text-left">Preview all banner</h2>
            <Carousel
              dots
              arrows
              className="rounded-lg overflow-hidden"
            >
              {props.bannerImages.map((url, index) => (
                <div key={index} className="flex justify-center items-center bg-black">
                  <img
                    src={url}
                    alt={`Banner ${index + 1}`}
                    className="max-h-60 w-auto object-contain mx-auto"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        );

      case 'publish':
        return (
          <div className="w-full">
            <div className="text-left mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Please change the status of one item before proceeding.
              </h2>
            </div>
            
            <div className="mb-6 max-h-96 overflow-auto">
              <AntTable {...props.tableData} />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button 
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                onClick={props.onConfirm}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600"
              >
                Confirm
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalWidth = () => {
    switch (props.type) {
      case 'publish':
        return 1200;
      case 'previewBanner':
        return 800;
      default:
        return 520;
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      closable
      width={getModalWidth()}
      className="rounded-xl"
    >
      <div className={props.type === 'publish' ? 'p-4' : 'text-center p-4'}>
        {renderContent()}
      </div>
    </Modal>
  );
};

export default UniversalDialog;