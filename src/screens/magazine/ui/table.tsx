import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Table, Switch, Button, Image, Dropdown, Modal, } from 'antd';
import { HolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined, EditFilled } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableColumnsType } from 'antd';
import { InputNumber } from 'antd';


export interface TableDataModel {
  text: string[];
  function: {
    onClick?: () => void;
  };
  title?: string;
  newsType?: string;
  front_id: string
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
  const [
    position,
    status,
    banner,
    issueNum,
    createdBy,
    lastEditedBy,
    createdAt,
    updatedAt,
    readVolume,
    likes,
    comments,
    shares,
    publishAt
  ] = item.text;

  return {
    key: item.front_id!,
    front_id: item.front_id,
    position,
    status: status === 'true',
    banner,
    createdBy,
    lastEditedBy,
    createdAt,
    updatedAt,
    publishAt,
    title: item.title ?? '',
    newsType: item.newsType ?? '',
    onAction: item.function.onClick,
    issueNum,
    readVolume: Number(readVolume),
    likes: Number(likes),
    comments: Number(comments),
    shares: Number(shares),
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

interface DataType {
  key: string;
  front_id: string;
  position: string;
  status: boolean;
  banner?: string;
  createdBy: string;
  lastEditedBy: string;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
  onAction?: () => void;
  title?: string;
  newsType: string;

  issueNum?: string;
  readVolume?: number;
  likes?: number;
  comments?: number;
  shares?: number;
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


export const AntTable: React.FC<AntTableProps> = ({ body, onEdit, onDelete }) => {

  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<DataType | null>(null);

  const [dataSource, setDataSource] = useState<DataType[]>([]);


  const handlePreview = (record: DataType) => {
    console.log('Preview record:', record);
    setPreviewImageUrl(record.banner);
    setPreviewRecord(record);
    setIsPreviewVisible(true);
  };

  const mappedData = useMemo(() => {
    return body.data.map((item, index) => toDataType(item, index));
  }, [body.data]);

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

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempVolume, setTempVolume] = useState<number>(0);

  const handleSave = (record: DataType) => {
    const updated = dataSource.map((item) =>
      item.front_id === record.front_id
        ? { ...item, readVolume: tempVolume }
        : item
    );

    setDataSource(updated);
    setEditingRow(null);

    const dbRequest = indexedDB.open("MyDB", 5);

    dbRequest.onsuccess = () => {
      const db = dbRequest.result;
      const tx = db.transaction("magazine-drafts", "readwrite");
      const store = tx.objectStore("magazine-drafts");

      // ดึงข้อมูลเดิมจาก store ก่อน
      const getRequest = store.get(record.front_id);

      getRequest.onsuccess = () => {
        const originalItem = getRequest.result;

        if (originalItem) {
          const updatedItem = updated.find(item => item.front_id === record.front_id);
          if (updatedItem) {
            const { onAction, ...safeItem } = updatedItem;

            // รวมข้อมูลเดิมเข้ากับข้อมูลใหม่
            const mergedItem = {
              ...originalItem,
              ...safeItem, // ค่านี้จะ override original
            };

            // รองรับ bannerFile → banner ถ้า banner ยังไม่มี
            if (!mergedItem.banner && mergedItem.bannerFile) {
              mergedItem.banner = mergedItem.bannerFile;
            }

            const putRequest = store.put(mergedItem);

            putRequest.onsuccess = () => {
              console.log("✅ Updated and saved to IndexedDB:", mergedItem);
            };

            putRequest.onerror = () => {
              console.error("❌ Failed to save:", putRequest.error);
            };
          }
        }
      };

      getRequest.onerror = () => {
        console.error("❌ Failed to get original item:", getRequest.error);
      };
    };
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
      width: 50,
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
      title: 'COVER',
      dataIndex: 'banner',
      key: 'banner',
      width: 80,
      align: 'center',
      render: (banner?: string) => (
        <div className="flex justify-center">
          <div className="rounded overflow-hidden border border-gray-200" style={{ width: 65, height: 95 }}>
            {banner ? (
              <Image
                src={banner}
                alt="Banner"
                preview={false}
                width={65}
                height={95}
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{ width: '100%', height: '100%' }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold"
              >
                COVER IMAGE
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'ISSUE NUMBER',
      dataIndex: 'issueNum',
      key: 'issueNum',
      width: 110,
      align: 'center',
      render: (issue: string) => <span>Issue #{issue || '-'}</span>,
    },
    {
      title: 'CREATED BY',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'LAST EDITED BY',
      dataIndex: 'lastEditedBy',
      key: 'lastEditedBy',
      width: 120,
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'CREATED AT',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 125,
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: 'UPDATE AT',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 125,
      render: (text: string) => <span>{formatDateTime(text)}</span>,
    },
    {
      title: 'READING VOLUME',
      dataIndex: 'readVolume',
      key: 'readVolume',
      width: 130,
      align: 'center',
      render: (_value: number, record: any) => {
        const isEditing = editingRow === record.front_id;
        return isEditing ? (
          <div className="flex gap-1 items-center">
            <InputNumber
              style={{ width: 60, fontSize: 12, borderColor: '#2962FF' }}
              min={0}
              value={tempVolume}
              onChange={(val) => setTempVolume(val ?? 0)}
              size="small"
            />
            <CheckOutlined
              onClick={() => handleSave(record)}
              className="text-[10px] cursor-pointer border border-gray-600 rounded-md p-1 hover:bg-gray-500 hover:text-white"
            />
            <CloseOutlined onClick={() => setEditingRow(null)}
              className="text-[10px] cursor-pointer border border-gray-600 rounded-md p-1 hover:bg-gray-500 hover:text-white"
            />
          </div>
        ) : (
          <div className="flex gap-2 items-center justify-center text-orange-600">
            <div className='text-blue-500 bg-blue-200 p-1 rounded w-20 text-xs'>
              {record.readVolume ?? 0}
            </div>
            <EditFilled
              className="cursor-pointer text-ms"
              onClick={() => {
                setEditingRow(record.front_id);
                setTempVolume(record.readVolume ?? 0);
              }}
            />
          </div>
        );
      }
    },
    {
      title: 'LIKES',
      dataIndex: 'likes',
      key: 'likes',
      width: 80,
      align: 'center',
      render: (value?: number) => <span>{value ?? 0}</span>,
    },
    {
      title: 'COMMENTS',
      dataIndex: 'comments',
      key: 'comments',
      width: 90,
      align: 'center',
      render: (value?: number) => <span>{value ?? 0}</span>,
    },
    {
      title: 'SHARES',
      dataIndex: 'shares',
      key: 'shares',
      width: 80,
      align: 'center',
      render: (value?: number) => <span>{value ?? 0}</span>,
    },
    {
      title: 'PUBLISH',
      key: 'publish',
      width: 130,
      render: (_, record) => (
        <div className="text-sm">{formatDateTime(record.publishAt)}</div>
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
    if (previewRecord) {
      return (
        <Modal
          open={isPreviewVisible}
          footer={null}
          onCancel={() => setIsPreviewVisible(false)}
          centered
        >
          <div className='font-bold text-[18px]'>Preview</div>
          <div
            style={{ position: 'relative', width: '130px', height: '210px', margin: '20px auto' }}
          >
            <div
              style={{
                border: 'solid 1px #ccc',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '30%',
                background: 'linear-gradient(to top, rgb(255, 255, 255), transparent)',
                zIndex: 1,
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                padding: '0 0 10px 15px',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: 2,
                wordWrap: 'break-word',
              }}
            >
              <div>{previewRecord.title ?? 'Header'}</div>
              <div style={{
                fontSize: '12px',
                fontWeight: '400',
              }}>Issue {previewRecord.issueNum ?? 'Issue Number'}</div>
            </div>
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={previewRecord.title ?? 'Header'}
                width={130}
                height={145}
                style={{
                  width: '130px',
                  height: '145px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  width: '130px',
                  height: '145px',
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
  }

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