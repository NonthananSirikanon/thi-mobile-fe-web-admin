import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Table, Switch, Button, Dropdown, } from 'antd';
import { HolderOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableColumnsType } from 'antd';

// ============ TYPES & INTERFACES ============
export interface TableDataModel {
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
  const [position, status, name, AuthorFullName, UpdatedFullName, createdAt, updatedAt, , publish] = item.text;
  const [publishDateTime] = publish?.split(' ') || ['--', '--'];

  return {
    key: item.id || index.toString(),
    position: position,
    status: status === 'true',
    name: name ?? '',
    createdBy: AuthorFullName ?? '',
    updatedBy: UpdatedFullName ?? '',
    createdAt: createdAt,
    updatedAt: updatedAt,
    publishDateTime: publishDateTime,
    onAction: item.function.onClick,
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
  position: string;
  status: boolean;
  name?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishDateTime: string;
  onAction?: () => void;
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

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ record, onEdit, onDelete }) => {
  const menuItems = [
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

  const [dataSource, setDataSource] = useState<DataType[]>([]);


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
      title: 'NEWS CATEGORY',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: (text: string) => (
        <span className="">{text}</span>
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

    </div>
  );
}