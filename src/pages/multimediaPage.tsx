import React from 'react';
import { Upload } from 'lucide-react';
import { Button, Flex } from "antd";
import { MultimediaTable } from '../components/ui/tabelv2';
import { useNavigate } from 'react-router-dom';




const MultimediaPage: React.FC = () => {
    const navigate = useNavigate();
    const uploadIcon = <Upload size={18} />;
    return (
        <Flex vertical gap={16}>
            <Flex justify='flex-end' gap={12}>
                <Button icon={uploadIcon} type="primary" onClick={() => navigate('/multimedia/upload')}>
                    UPLOAD VIDEO
                </Button>
                <Button color='green' style={{ backgroundColor: 'green', color: '#FFFFFF' }} onClick={() => console.log('Publish clicked')}>
                    PUBLISH
                </Button>
            </Flex>
            <MultimediaTable />
        </Flex >
    );
};

export default MultimediaPage;