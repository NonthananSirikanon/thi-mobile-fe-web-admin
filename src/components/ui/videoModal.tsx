import React, { use, useEffect } from 'react';
import { Button, Modal } from 'antd';

interface DeleteModalProps {
    open?: boolean;
    onClose?: () => void;
    videoUrl?: string;
    thumbnailUrl?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, videoUrl, thumbnailUrl, onClose }) => {
    useEffect(() => {
        console.log('url', videoUrl);
    }
        , [open, videoUrl]);
    return (
        <>
            <Modal
                title="Preview"
                open={open}
                centered={true}
                footer={null} // No footer buttons
                onCancel={onClose}
                // responsive
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}
            >
                <div className='text-center'>
                    {videoUrl ? (
                        <video controls poster={thumbnailUrl} style={{ maxWidth: '100%', marginTop: '16px' }}>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p>No video available for preview.</p>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default DeleteModal;