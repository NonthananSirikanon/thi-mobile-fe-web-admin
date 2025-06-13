import React, { useContext, useEffect, useMemo, useState } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Switch from './switch';
import ActionsDropdown from './actionDropdown';
import DeleteModal from './deleteModal';
import { message } from 'antd';


interface DataType {
    key: string;
    status: boolean;
    videoFileName: string;
    thumbnail?: any;
    readingVolume: number;
    createdBy: string;
    lastEditedBy: string;
    createdAt: string;
    updatedAt: string;
    publish: string;
    action?: any;
}

interface RowContextProps {
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
    listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{ cursor: 'move' }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row: React.FC<RowProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props['data-row-key'] });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    const contextValue = useMemo<RowContextProps>(
        () => ({ setActivatorNodeRef, listeners }),
        [setActivatorNodeRef, listeners],
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

const initialData: DataType[] = [
    {
        key: '1',
        videoFileName: 'John Brown',
        status: false,
        thumbnail: 'https://dummyimage.com/600x400/000/fff',
        readingVolume: 120,
        createdBy: 'Alice',
        lastEditedBy: 'Bob',
        createdAt: '2024-06-01 10:00',
        updatedAt: '2024-06-10 15:30',
        publish: '2024-06-12 09:00',
    },
];


export const MultimediaTable: React.FC = () => {
    const [dataSource, setDataSource] = useState<DataType[]>(initialData);
    /**
     * * Modal state management for delete confirmation
     */
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | undefined>('');
    const [deleteKey, setDeleteKey] = useState<string | null>(null);
    const confirmDelete = () => {
        if (deleteKey) {
            setDataSource((prevState) => prevState.filter((item) => item.key !== deleteKey));
            setModalOpen(false);
            setDeleteKey(null);
            setSelectedThumbnail('');
            message.success('Successful! deleted');

        }
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setDataSource((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.key === active?.id);
                const overIndex = prevState.findIndex((record) => record.key === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            });
        }
    };


    // Log the data source whenever it changes
    useEffect(() => {
        console.log('Data source updated:', dataSource);
    }, [dataSource]);


    // Function to handle status change
    const handleStatusChange = (key: string, status: boolean) => {
        setDataSource((prevState) =>
            prevState.map((item) =>
                item.key === key ? { ...item, status } : item

            )
        );
    };


    // columns 
    const columns: TableColumnsType<DataType> = [
        { key: 'sort', title: 'Position', align: 'center', width: 80, render: () => <DragHandle /> },

        {
            title: 'Status', dataIndex: 'status', render: (status, record) => (
                <Switch checked={status} onChange={(check) => { handleStatusChange(record.key, check) }} />
            )
        },
        {
            title: 'Thumbnail', dataIndex: 'thumbnail', render: (thumbnail) => {
                return thumbnail ? <img src={thumbnail} alt="Thumbnail" style={{ width: 100, height: 60, objectFit: 'cover' }} /> : 'No Thumbnail';
            }
        },
        { title: 'Video File Name', dataIndex: 'videoFileName' },
        { title: 'Reading Volume', dataIndex: 'readingVolume' },
        { title: 'Created By', dataIndex: 'createdBy' },
        { title: 'Last Edited By', dataIndex: 'lastEditedBy' },
        { title: 'Created At', dataIndex: 'createdAt' },
        { title: 'Updated At', dataIndex: 'updatedAt' },
        { title: 'Publish', dataIndex: 'publish' },
        {
            title: 'Action', dataIndex: 'action', render: (_, record) => (
                <ActionsDropdown
                    onDelete={() => {
                        setSelectedThumbnail(record.thumbnail);
                        setDeleteKey(record.key);
                        setModalOpen(true);

                    }}
                />
            )
        },
    ];

    return (
        <>
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                    <Table<DataType>
                        rowKey="key"
                        components={{ body: { row: Row } }}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                </SortableContext>
            </DndContext>
            <DeleteModal imageUrl={selectedThumbnail} open={modalOpen} onOk={confirmDelete} onCancel={() => setModalOpen(false)} />
        </>
    );
};
