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
import { Button, message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Switch from './switch';
import ActionsDropdown from './actionDropdown';
import DeleteModal from './deleteModal';
import { useVideos } from '../../hooks/useMedia';
import { useNavigate } from 'react-router-dom';
import type { Media } from '../../utility/idb/idbType';
import { Video } from 'lucide-react';
import VideoModal from './videoModal';


type DataType = Media

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
    // {
    //     id: '0',
    //     frontendId: '2',
    //     videoFileName: 'John Bwn',
    //     status: true,
    //     thumbnail: null,
    //     readingVolume: 120,
    //     createdBy: 'Alice',
    //     lastEditedBy: 'Bob',
    //     createdAt: '2024-06-01 10:00',
    //     updatedAt: '2024-06-10 15:30',
    //     publish: '2024-06-12 09:00',
    // },
    // {
    //     id: '0',
    //     frontendId: '1',
    //     videoFileName: 'John Brown',
    //     status: false,
    //     thumbnail: null,
    //     readingVolume: 120,
    //     createdBy: 'Alice',
    //     lastEditedBy: 'Bob',
    //     createdAt: '2024-06-01 10:00',
    //     updatedAt: '2024-06-10 15:30',
    //     publish: '2024-06-12 09:00',
    // },
];

interface MultimediaTableProps {
    isPublic?: boolean;
}

export const MultimediaTable: React.FC<MultimediaTableProps> = ({ isPublic }) => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<DataType[]>(initialData);
    const { videos, loading, error, deleteVideo, updateVideo, reorderVideos } = useVideos();


    // if (loading) return <div>Loading videos...</div>;
    // if (error) return <div>Error: {error}</div>;

    /**
     * * Modal state management for delete confirmation
     */
    const [modalOpen, setModalOpen] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | undefined>('');
    const [selectedVideo, setSelectedVideo] = useState<string | undefined>('');
    const [deleteKey, setDeleteKey] = useState<string | null>(null);
    const confirmDelete = () => {
        if (deleteKey) {
            // setDataSource((prevState) => prevState.filter((item) => item.key !== deleteKey));
            deleteVideo(deleteKey)
            setModalOpen(false);
            setDeleteKey(null);
            setSelectedThumbnail('');
            message.success('Successful! deleted');

        }
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const activeIndex = videos.findIndex((record) => record.frontendId === active?.id);
            const overIndex = videos.findIndex((record) => record.frontendId === over?.id);
            const newOrder = arrayMove(videos, activeIndex, overIndex);
            reorderVideos(newOrder);
        }
    };

    useEffect(() => {
        // Log when the order of videos changes (after drag)
        console.log('Videos order changed:', videos);
    }, [videos]);
    // Function to handle status change
    const handleStatusChange = (key: string, status: boolean) => {
        updateVideo(key, { status })
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
                <Switch checked={status} onChange={(check) => { handleStatusChange(record.frontendId, check) }} />
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
        !isPublic ? { title: 'Reading Volume', dataIndex: 'readingVolume' } : {},
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
        !isPublic ? { title: 'Publish', dataIndex: 'publish' } : {},
        !isPublic ? {
            title: 'Action', dataIndex: 'action', render: (_, record) => (
                <ActionsDropdown
                    onDelete={() => {
                        let thumb = record.thumbnail;
                        let thumbUrl: string | undefined | null;
                        if (thumb instanceof Blob) {
                            thumbUrl = URL.createObjectURL(thumb);
                        } else {
                            thumbUrl = thumb;
                        }
                        setSelectedThumbnail(thumbUrl ?? undefined);
                        setDeleteKey(record.frontendId);
                        setModalOpen(true);
                    }}
                    onEdit={() => {
                        navigate(`/multimedia/edit/${record.frontendId}`);
                    }}
                    onPreview={() => {
                        let thumb = record.thumbnail;
                        let thumbUrl: string | undefined | null;
                        if (thumb instanceof Blob) {
                            thumbUrl = URL.createObjectURL(thumb);
                        } else {
                            thumbUrl = thumb;
                        }
                        setSelectedThumbnail(thumbUrl ?? undefined);
                        setSelectedVideo(record.videoUrl);
                        setVideoModalOpen(true);
                    }}
                />
            )
        } : {},
    ];

    return (
        <>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext items={videos.map((i) => i.frontendId)} strategy={verticalListSortingStrategy}>
                        <Table<DataType>
                            rowKey="frontendId"
                            components={{ body: { row: Row } }}
                            columns={columns}
                            dataSource={videos}
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            size='middle'
                            style={{
                                '--ant-table-header-bg': '#fafafa',
                                '--ant-table-header-color': '#8c8c8c',
                                '--ant-table-header-font-size': '12px',
                                '--ant-table-header-font-weight': '600',
                            } as React.CSSProperties}
                            className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:text-gray-500 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:tracking-wide [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
                        />
                    </SortableContext>
                </DndContext>
                <DeleteModal imageUrl={selectedThumbnail} open={modalOpen} onOk={confirmDelete} onCancel={() => setModalOpen(false)} />
                <VideoModal open={videoModalOpen} videoUrl={selectedVideo} thumbnailUrl={selectedThumbnail} onClose={() => setVideoModalOpen(false)} />
            </div >
        </>
    );
};
