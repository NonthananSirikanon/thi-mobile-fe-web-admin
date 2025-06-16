import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button, Flex, Modal } from "antd";
import { MultimediaTable } from '../components/ui/tabelv2';
import { useNavigate } from 'react-router-dom';




const MultimediaPage: React.FC = () => {
    const navigate = useNavigate();
    const uploadIcon = <Upload size={18} />;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Flex vertical gap={16}>
            <Flex justify='flex-end' gap={12}>
                <Button icon={uploadIcon} type="primary" onClick={() => navigate('/multimedia/upload')}>
                    UPLOAD VIDEO
                </Button>
                <Button color='green' style={{ backgroundColor: 'green', color: '#FFFFFF' }} onClick={() => showModal()}>
                    PUBLISH
                </Button>
            </Flex>
            <MultimediaTable />
            <Modal
                // title="Basic Modal"
                closable={false}
                open={isModalOpen}
                width={
                    {
                        xs: '90%',
                        sm: '80%',
                        md: '70%',
                        lg: '60%',
                        xl: '50%',
                        xxl: '40%',
                    }
                }
                footer={
                    <div style={{ width: '100%', }}>
                        <Button key="back" color="danger" variant="outlined" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button key="submit" type="primary" onClick={handleOk} style={{ marginLeft: 8 }}>
                            Delete
                        </Button>
                    </div>
                }
            >
                <div className='text-center'>
                    <h5>Please change the status of one item before proceeding.</h5>
                    <MultimediaTable isPublic={true} />
                </div>
            </Modal>
        </Flex >
    );
};

export default MultimediaPage;