import { MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
interface ActionsDropdownProps {
    record?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onPreview?: () => void;
}



const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ onEdit, onDelete, onPreview }) => {
    const menuItems = [
        {
            key: 'preview',
            icon: <EyeOutlined />,
            label: 'Preview',
            onClick: onPreview,
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            onClick: onEdit,
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: onDelete,
            danger: true,
        },

    ];

    return (
        <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
            arrow={{ pointAtCenter: true }}
        >
            <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
            />
        </Dropdown>
    );
};

export default ActionsDropdown;