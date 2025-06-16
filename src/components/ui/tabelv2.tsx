import React, { use, useContext, useEffect, useMemo, useState } from 'react';
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
import { useVideos } from '../../hooks/useMedia';


interface DataType {
    key: string;
    status: boolean;
    videoFileName: string;
    thumbnail: File | any; // URL or base64
    readingVolume: number;
    videoUrl?: string; // URL to the video file
    createdBy: string; // user ID or name
    lastEditedBy: string; // user ID or name
    createdAt: Date | string; // Use string if you want to display formatted date
    updatedAt: Date | string; // Use string if you want to display formatted date
    publish: Date | string;
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
        key: '2',
        videoFileName: 'John Bwn',
        status: true,
        thumbnail: 'https://dummyimage.com/600x400/000/fff',
        readingVolume: 120,
        createdBy: 'Alice',
        lastEditedBy: 'Bob',
        createdAt: '2024-06-01 10:00',
        updatedAt: '2024-06-10 15:30',
        publish: '2024-06-12 09:00',
    },
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
    const { videos, loading, error } = useVideos();


    // if (loading) return <div>Loading videos...</div>;
    // if (error) return <div>Error: {error}</div>;

    /**
     * * Modal state management for delete confirmation
     */
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | undefined>('');
    const [deleteKey, setDeleteKey] = useState<string | null>(null);
    const confirmDelete = () => {
        // if (deleteKey) {
        //     setDataSource((prevState) => prevState.filter((item) => item.key !== deleteKey));
        //     setModalOpen(false);
        //     setDeleteKey(null);
        //     setSelectedThumbnail('');
        //     message.success('Successful! deleted');

        // }
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
        console.log('Data source updated:', videos);
    }, [dataSource, videos]);


    // Function to handle status change
    const handleStatusChange = (key: string, status: boolean) => {
        // setDataSource((prevState) =>
        //     prevState.map((item) =>
        //         item.key === key ? { ...item, status } : item

        //     )
        // );
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
                // Handle File objects vs URL strings
                if (thumbnail instanceof File) {
                    const url = URL.createObjectURL(thumbnail);
                    return <img src={url} alt="Thumbnail" style={{ width: 100, height: 60, objectFit: 'cover' }} />;
                }
                return thumbnail ? <img src={thumbnail} alt="Thumbnail" style={{ width: 100, height: 60, objectFit: 'cover' }} /> : 'No Thumbnail';
            }
        },
        { title: 'Video File Name', dataIndex: 'videoFileName' },
        { title: 'Reading Volume', dataIndex: 'readingVolume' },
        { title: 'Created By', dataIndex: 'createdBy' },
        { title: 'Last Edited By', dataIndex: 'lastEditedBy' },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (createdAt) => {
                if (!createdAt) return '-';
                const date = new Date(createdAt);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            }
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            render: (updatedAt) => {
                if (!updatedAt) return '-';
                const date = new Date(updatedAt);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            }
        },
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
                <SortableContext items={videos.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                    <Table<DataType>
                        rowKey="key"
                        components={{ body: { row: Row } }}
                        columns={columns}
                        dataSource={videos}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                </SortableContext>
            </DndContext>
            <DeleteModal imageUrl={selectedThumbnail} open={modalOpen} onOk={confirmDelete} onCancel={() => setModalOpen(false)} />
        </>
    );
};
