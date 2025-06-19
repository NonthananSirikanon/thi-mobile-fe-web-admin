import React, { useState, useContext, useMemo, useEffect } from 'react';
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
  front_id: string;
  id: string;
  text: string[];
  function: {
    onClick?: () => void;
  };
  title?: string;
  type?: string;
  category?: number;
  agency?: number;
}

interface AntTableProps extends Omit<TableModel, 'header'> {
  onEdit?: (record: DataType) => void;
  onDelete?: (record: DataType) => void;
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

const formatDateTime = (datetime: string): string => {
  if (!datetime) return '--/--/---- --:--';
  const date = new Date(datetime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const toDataType = (item: TableDataModel, index: number): DataType => {
  const [position, status, thumbnail, , , createdAt, updatedAt, , publish] = item.text;
  const [publishDateTime] = publish?.split(' ') || ['--', '--'];

  const createdBy = Number(item.text[3]) || 0;
  const updatedBy = Number(item.text[4]) || 0;


  return {
    key: item.front_id || item.id || index.toString(),
    position: position,
    status: status === 'true',
    thumbnail: thumbnail,
    createdBy: createdBy ?? 0,
    updatedBy: updatedBy ?? 0,
    createdAt: createdAt,
    updatedAt: updatedAt,
    publishDateTime: publishDateTime,
    title: item.title ?? '',
    type: item.type ?? '',
    onAction: item.function.onClick,
    category: item.category ?? 0,
    agency: item.agency ?? 0,
  };
};


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
  thumbnail?: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  publishDateTime: string;
  onAction?: () => void;
  title?: string;
  type: string;
  category: number;
  agency: number;
}

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
    ...(isDragging ? { backgroundColor: '#f0f0f0', opacity: 0.9 } : {}),
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
export const AntTable: React.FC<AntTableProps> = ({ body, onEdit, onDelete }) => {

  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<DataType | null>(null);

  const [dataSource, setDataSource] = useState<DataType[]>([]);


  const handlePreview = (record: DataType) => {
    setPreviewImageUrl(record.thumbnail);
    setPreviewRecord(record);
    setIsPreviewVisible(true);
  };

  const mappedData = useMemo(() => {
    return body.data.map((item, index) => toDataType(item, index));
  }, [body.data]);

  // Transform data from TableDataModel to DataType
  useEffect(() => {
    setDataSource(mappedData);
  }, [mappedData]);

  const handleStatusChange = (key: string, checked: boolean) => {
    setDataSource(prev =>
      prev.map(item =>
        item.key === key ? { ...item, status: checked } : item
      )
    );
  };

  const handleEdit = (record: DataType) => {
    onEdit?.(record);
  };

  const handleDelete = (record: DataType) => {
    onDelete?.(record);
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
      title: 'COVER IMAGE',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 120,
      align: 'center',
      render: (thumbnail?: string) => (
        <div className="flex justify-center">
          <div className="w-16 h-10 rounded overflow-hidden border border-gray-200">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt="Banner"
                width={64}
                height={40}
                style={{ objectFit: 'cover' }}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2NCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8dGV4dCB4PSIzMiIgeT0iMjIiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CQU5ORVI8L3RleHQ+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMF8xIiB4MT0iMCIgeTE9IjAiIHgyPSI2NCIgeTI9IjQwIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4QjVDRjYiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMzk4M0Y2Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHN2Zz4K"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                COVER IMAGE
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'CREATED BY',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
      render: (text: string) => (
        <span className="">{text}</span>
      ),
    },
    {
      title: 'LAST EDITED BY',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      width: 120,
      render: (text: string) => (
        <span className="">{text}</span>
      ),
    },
    {
      title: 'CREATED AT',
      key: 'createAt',
      width: 150,
      render: (_, record) => (
        <div className="flex">
          <div className="text-sm">{formatDateTime(record.createdAt)}</div>
        </div>
      ),
    },
    {
      title: 'UPDATE AT',
      key: 'updateAt',
      width: 150,
      render: (_, record) => (
        <div className="flex">
          <div className="text-sm">{formatDateTime(record.updatedAt)}</div>
        </div>
      ),
    },
    {
      title: 'PUBLISH',
      key: 'publishDate',
      width: 130,
      render: (_, record) => (
        <div className="flex">
          <div className="text-sm">{formatDateTime(record.publishDateTime)}</div>
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

  const renderPreviewModal = () => {
    if (!previewRecord || !['Hotnews', 'Featurenews'].includes(previewRecord.type)) return null;

    if (previewRecord.type === 'Featurenews') {

      return (
        <Modal
          open={isPreviewVisible}
          footer={null}
          onCancel={() => setIsPreviewVisible(false)}
          centered
        >
          <div className='font-bold text-[18px]'>Preview</div>
          <div
            style={{ position: 'relative', width: '310px', height: '175px', margin: '20px auto' }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '40%',
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                zIndex: 1,
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                color: 'white',
                backgroundColor: '#FB6323',
                margin: '10px 0 0 10px',
                padding: '7px',
                fontSize: '10px',
                fontWeight: '500',
                zIndex: 2,
                wordWrap: 'break-word',
                lineHeight: '1.3',
                borderRadius: '5px',
              }}
            >
              {previewRecord.category ?? 'Header'}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                color: 'white',
                padding: '0 0 10px 10px',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 2,
                wordWrap: 'break-word',
                lineHeight: '1.3',
              }}
            >
              {previewRecord.title ?? 'Header'}
            </div>
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={previewRecord.title ?? 'Header'}
                width={310}
                height={175}
                style={{
                  width: '310px',
                  height: '175px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: '310px',
                  height: '175px',
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
      );
    }

    if (previewRecord.type === 'Hotnews') {
      return (
        <Modal
          open={isPreviewVisible}
          footer={null}
          onCancel={() => setIsPreviewVisible(false)}
          centered
        >
          <div className="font-bold text-[18px] mb-4">Preview</div>

          <div
            className="flex gap-4"
            style={{ width: '100%', maxWidth: '600px', margin: '20px auto', padding: 25, alignItems: 'flex-start' }}
          >
            <div className="w-2/3 h-[90px] flex flex-col justify-between py-1">
              <div className="text-[14px]">
                {previewRecord.title ?? 'Header'}
              </div>

              <div className="text-[12px] text-gray-500 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <EyeOutlined /> {0}
                </span>
                <span className="border-l border-gray-300 pl-2 ml-2">
                  {previewRecord.publishDateTime}
                </span>
              </div>

            </div>


            {/* Right Side: Image */}
            <div className='w-1/3'>
              {previewImageUrl ? (
                <Image
                  src={previewImageUrl}
                  alt={previewRecord.title ?? 'Header'}
                  width={140}
                  height={100}
                  style={{
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '310px',
                    height: '175px',
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
          </div>
        </Modal>
      );
    }

    return null;
  };



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

      {renderPreviewModal()}
    </div>
  );
}