import React, { useState, useContext, useMemo } from 'react';
import { Table, Switch, Button, Image, Dropdown, Modal, } from 'antd';
import { HolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableColumnsType } from 'antd';

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
  position: string;
  status: boolean;
  banner?: string;
  url: string;
  createdBy: string;
  editedBy: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
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

const ActionsDropdown: React.FC<ActionsDropdownProps & { onPreview: (record: DataType) => void }> = ({ record, onEdit, onDelete, onPreview }) => {
  const menuItems = [
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: 'Preview',
      onClick: () => onPreview(record),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => onEdit(record),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
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
const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
const [isPreviewVisible, setIsPreviewVisible] = useState(false);

const handlePreview = (record: DataType) => {
  setPreviewImageUrl(record.banner);
  setIsPreviewVisible(true);
};

  // Transform data from TableDataModel to DataType
  const [dataSource, setDataSource] = useState<DataType[]>(() => 
    body.data.map((item, index) => ({
      key: `row-${index}`,
      position: item.text[0] || '',
      status: item.text[1] === 'true' || item.text[1]?.includes('true'),
      banner: item.text[2] && item.text[2] !== 'banner' ? item.text[2] : undefined,
      url: item.text[3] || '-',
      createdBy: item.text[4] || 'Text',
      editedBy: item.text[5] || 'Text',
      startDate: item.text[6]?.split(' ')[0] || '31/08/2022',
      startTime: item.text[6]?.split(' ')[1] || '20:00',
      endDate: item.text[7]?.split(' ')[0] || '31/08/2022',
      endTime: item.text[7]?.split(' ')[1] || '20:00',
      duration: item.text[8] || '5(s)',
      publishDate: item.text[9]?.split(' ')[0] || '31/12/2024',
      publishTime: item.text[9]?.split(' ')[1] || '20:00',
      onAction: item.function.onClick,
    }))
  );

  const handleStatusChange = (key: string, checked: boolean) => {
    setDataSource(prev => 
      prev.map(item => 
        item.key === key ? { ...item, status: checked } : item
      )
    );
  };

  const handleEdit = (record: DataType) => {
    console.log('Edit record:', record);
    // เรียก function เดิมถ้ามี
    if (record.onAction) {
      record.onAction();
    }
    // เพิ่ม logic สำหรับแก้ไขตรงนี้
  };

  const handleDelete = (record: DataType) => {
    console.log('Delete record:', record);
    // เพิ่ม logic สำหรับลบตรงนี้
    setDataSource(prev => prev.filter(item => item.key !== record.key));
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
      width: 120,
      align: 'center',
      render: (banner?: string) => (
        <div className="flex justify-center">
          <div className="w-16 h-10 rounded overflow-hidden border border-gray-200">
            {banner ? (
              <Image
                src={banner}
                alt="Banner"
                width={64}
                height={40}
                style={{ objectFit: 'cover' }}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2NCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8dGV4dCB4PSIzMiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CQU5ORVI8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8xIiB4MT0iMCIgeTE9IjAiIHgyPSI2NCIgeTI9IjQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4QjVDRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzk4M0Y2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                BANNER
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      width: 200,
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
      width: 120,
      render: (text: string) => (
        <span className="text-gray-900">{text}</span>
      ),
    },
    {
      title: 'EDITED BY',
      dataIndex: 'editedBy',
      key: 'editedBy',
      width: 120,
      render: (text: string) => (
        <span className="text-gray-900">{text}</span>
      ),
    },
    {
      title: 'START DATE- START TIME',
      key: 'startDateTime',
      width: 150,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 font-medium">{record.startDate}</div>
          <div className="text-gray-500 text-sm">{record.startTime}</div>
        </div>
      ),
    },
    {
      title: 'END DATE - END TIME',
      key: 'endDateTime',
      width: 150,
      render: (_, record) => (
        <div className="text-center">
          <div className="text-gray-900 font-medium">{record.endDate}</div>
          <div className="text-gray-500 text-sm">{record.endTime}</div>
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
      width: 130,
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
          onPreview={handlePreview}
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
          components={{ body: { row: Row } }}
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

    <Modal
  open={isPreviewVisible}
  footer={null}
  onCancel={() => setIsPreviewVisible(false)}
  centered
>
  <div style={{ position: 'relative' }}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '4px 8px',
        fontSize: '12px',
        borderBottomRightRadius: '6px',
        zIndex: 1,
      }}
    >
      Preview
    </div>

    {previewImageUrl ? (
      <Image
        src={previewImageUrl}
        alt="Preview"
        width="100%"
        style={{ maxHeight: '70vh', objectFit: 'contain' }}
      />
    ) : (
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#999',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        ไม่มีรูป
      </div>
    )}
  </div>
</Modal>
  </div>
);
};