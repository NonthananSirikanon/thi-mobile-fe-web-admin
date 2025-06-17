import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Table, Switch, Button, Image, Dropdown } from 'antd';
import { HolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableColumnsType } from 'antd';
import { useNavigate } from 'react-router-dom';
import UniversalDialog from './dialog';

// ============ INDEXEDDB UTILITIES ============
const DB_NAME = 'BannerDB';
const DB_VERSION = 2;
const STORE_NAME = 'banners';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'front_id', autoIncrement: true });
      store.createIndex('position', 'position', { unique: false });
    };
  });
};

const deleteBannerFromDB = async (front_id: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(front_id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// ============ TYPES & INTERFACES ============
export interface TableDataModel {
  text: string[];
  function: {
    onClick?: () => void; 
  };
}

export interface TableBodyModel {
  data: TableDataModel[];
}

export interface TableModel {
  header: string[];
  body: TableBodyModel;
}

// ============ DRAG CONTEXT ============
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

// ============ DATA TYPE ============
interface DataType {
  key: string;
  front_id?: number;
  position: string;
  status: boolean;
  banner?: string;
  url: string;
  createdBy: string;
  editedBy: string;
  createdAt: string;
  createdTime: string;
  updateAt: string;
  updateTime: string;
  duration: string;
  publishDate: string;
  publishTime: string;
  onAction?: () => void;
}

// ============ ROW COMPONENT ============
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
  } = useSortable({
    id: props['data-row-key'],
  });

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

// ============ ACTIONS DROPDOWN COMPONENT ============
interface ActionsDropdownProps {
  record: DataType;
  onEdit: (record: DataType) => void;
  onDelete: (record: DataType) => void;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ record, onEdit, onDelete }) => {
  const menuItems = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'แก้ไข',
      onClick: () => onEdit(record),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'ลบ',
      onClick: () => onDelete(record),
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

// ============ MAIN TABLE COMPONENT ============
export const AntTable: React.FC<Omit<TableModel, 'header'>> = ({ body }) => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  useEffect(() => {
    const newDataSource = body.data.map((item, index) => ({
      key: `row-${index}`,
      front_id: parseInt(item.text[10]) || undefined,
      position: item.text[0] || '',
      status: item.text[1] === 'true' || item.text[1]?.includes('true'),
      banner: item.text[2] && item.text[2] !== 'banner' ? item.text[2] : undefined,
      url: item.text[3] || '-',
      createdBy: item.text[4] || 'Text',
      editedBy: item.text[5] || 'Text',
      createdAt: item.text[6]?.split(' ')[0] || '31/08/2022',
      createdTime: item.text[6]?.split(' ')[1] || '20:00',
      updateAt: item.text[7]?.split(' ')[0] || '31/08/2022',
      updateTime: item.text[7]?.split(' ')[1] || '20:00',
      duration: item.text[8] || '5(s)',
      publishDate: item.text[9]?.split(' ')[0] || '31/12/2024',
      publishTime: item.text[9]?.split(' ')[1] || '20:00',
      onAction: item.function.onClick,
    }));
    setDataSource(newDataSource);
  }, [body.data]);

  const handleStatusChange = (key: string, checked: boolean) => {
    setDataSource(prev => 
      prev.map(item => 
        item.key === key ? { ...item, status: checked } : item
      )
    );
  };

  const handleEdit = (record: DataType) => {
    console.log('Edit record:', record);
    
    const editParams = new URLSearchParams({
      mode: 'edit',
      front_id: record.front_id?.toString() || '',
      position: record.position,
      status: record.status.toString(),
      banner: record.banner || '',
      url: record.url === '-' ? '' : record.url,
      duration: record.duration.replace('(s)', ''),
      createdBy: record.createdBy,
      editedBy: record.editedBy,
      createdAt: record.createdAt,
      createdTime: record.createdTime,
      updateAt: record.updateAt,
      updateTime: record.updateTime,
      publishDate: record.publishDate,
      publishTime: record.publishTime,
    });
    
    navigate(`/addbanner?${editParams.toString()}`);
    
    if (record.onAction) {
      record.onAction();
    }
  };

  const handleDelete = (record: DataType) => {
    setSelectedRecord(record);
    setIsDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      if (selectedRecord.front_id) {
        await deleteBannerFromDB(selectedRecord.front_id);
        console.log('Deleted from IndexedDB with front_id:', selectedRecord.front_id);
      }
      
      setDataSource(prev => prev.filter(item => item.key !== selectedRecord.key));
      
    } catch (error) {
      console.error('Error deleting banner from IndexedDB:', error);
      setDataSource(prev => prev.filter(item => item.key !== selectedRecord.key));
    } finally {
      setIsDeleteDialogVisible(false);
      setSelectedRecord(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogVisible(false);
    setSelectedRecord(null);
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

  const columns: TableColumnsType<DataType> = [
    {
      title: 'POSITION',
      dataIndex: 'position',
      key: 'position',
      width: 100,
      render: () => (
        <div className="flex items-center gap-2">
          <DragHandle />
        </div>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.key, checked)}
          size="small"
        />
      ),
    },
    {
      title: 'BANNER',
      dataIndex: 'banner',
      key: 'banner',
      width: 100,
      align: 'center',
      render: (banner?: string) => (
        <div className="flex justify-center">
          <div className="w-16 h-10 rounded overflow-hidden border border-gray-200">
              <Image
                src={banner}
                alt="Banner"
                width={64}
                height={40}
                style={{ objectFit: 'cover' }}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2NCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8dGV4dCB4PSIzMiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CQU5ORUI8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8xIiB4MT0iMCIgeTE9IjAiIHgyPSI2NCIgeTI9IjQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4QjVDRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzk4M0Y2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K"
              />
          </div>
        </div>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 100,
      render: (url: string) => {
        if (url === '-') {
          return <span className="text-gray-400">-</span>;
        }
        return (
          <a
            href={url}
            className="text-blue-600 hover:text-blue-800 hover:underline max-w-[180px] truncate block"
            target="_blank"
            rel="noopener noreferrer"
            title={url}
          >
            {url}
          </a>
        );
      },
    },
    {
      title: 'CREATED BY',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 100,
      render: (text: string) => (
        <span className="text-gray-900">{text}</span>
      ),
    },
    {
      title: 'EDITED BY',
      dataIndex: 'editedBy',
      key: 'editedBy',
      width: 100,
      render: (text: string) => (
        <span className="text-gray-900">{text}</span>
      ),
    },
    {
      title: 'CREATED AT',
      dataIndex: 'createdat',
      key: 'createdat',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 font-medium">{record.createdAt}</div>
          <div className="text-gray-500 text-sm">{record.createdTime}</div>
        </div>
      ),
    },
    {
      title: 'UPDATED AT',
      dataIndex: 'updatedat',
      key: 'updatedat',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 font-medium">{record.updateAt}</div>
          <div className="text-gray-500 text-sm">{record.updateTime}</div>
        </div>
      ),
    },
    {
      title: 'DURATION',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center',
      render: (text: string) => (
        <span className="text-gray-900 font-medium">{text}</span>
      ),
    },
    {
      title: 'PUBLISH',
      key: 'publishDateTime',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 font-medium">{record.publishDate}</div>
          <div className="text-gray-500 text-sm">{record.publishTime}</div>
        </div>
      ),
    },
    {
      title: 'ACTION',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <ActionsDropdown
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table<DataType>
            rowKey="key"
            components={{
              body: {
                row: Row,
              },
            }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="middle"
            scroll={{ x: 'max-content' }}
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
      <UniversalDialog
        type="delete"
        visible={isDeleteDialogVisible}
        onCancel={cancelDelete}
        onDelete={confirmDelete}
        imageUrl={selectedRecord?.banner}
      />
    </div>
  );
};