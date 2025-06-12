// components/ImagePreviewModal.tsx
import React from 'react';
import { Modal, Image } from 'antd';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUrl?: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      title="Image Preview"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Banner Preview"
          width="100%"
          style={{ objectFit: 'contain', maxHeight: 400 }}
        />
      ) : (
        <div className="text-center text-gray-500">No image available.</div>
      )}
    </Modal>
  );
};

export default ImagePreviewModal;
