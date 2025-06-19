import React from 'react';
import { Button, Modal } from 'antd';

interface DeleteModalProps {
    open?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    imageUrl?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ imageUrl, open, onCancel, onOk }) => {
    return (
        <>
            <Modal
                closable={false}
                open={open}
                centered={true}

                // responsive
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}

                footer={
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <Button key="back" color="danger" variant="outlined" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button key="submit" type="primary" onClick={onOk} style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </div>
                }
            >
                <div className='text-center'>
                    <h1 className='text-xl font-semibold'>Delete Confirmation</h1>
                    <p className=''>
                        Are you sure you want to permanently delete this item?
                        <br />
                        This action cannot be undone.
                    </p>
                    {imageUrl && <img src={imageUrl} alt="อาร่อยยย" style={{ maxWidth: 200, margin: '16px auto' }} />}
                </div>
            </Modal>
        </>
    );
};

export default DeleteModal;