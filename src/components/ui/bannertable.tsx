import React from 'react';
import { Table, Switch, Button, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EllipsisOutlined } from '@ant-design/icons';

type BannerItem = {
  key: string;
  position: string;
  status: boolean;
  bannerUrl: string;
  link: string;
  createdBy: string;
  editedBy: string;
  start: string;
  end: string;
  duration: string;
  publish: string;
};

type BannerTableProps = {
  data: BannerItem[];
  onToggleStatus?: (key: string, checked: boolean) => void;
};

const BannerTable: React.FC<BannerTableProps> = ({ data, onToggleStatus }) => {
  const columns: ColumnsType<BannerItem> = [
    {
      title: 'POSITION',
      dataIndex: 'position',
      render: () => <span className="cursor-move">=</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (checked, record) => (
        <Switch
          checked={checked}
          onChange={(val) => onToggleStatus?.(record.key, val)}
          className="bg-green-500"
        />
      ),
    },
    {
      title: 'BANNER',
      dataIndex: 'bannerUrl',
      render: (url) => <Image src={url} alt="banner" width={60} preview={false} />,
    },
    {
      title: 'URL',
      dataIndex: 'link',
      render: (url) =>
        url ? (
          <a href={url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            {url.length > 15 ? url.slice(0, 15) + '...' : url}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'CREATED BY',
      dataIndex: 'createdBy',
    },
    {
      title: 'EDITTED BY',
      dataIndex: 'editedBy',
    },
    {
      title: 'START DATE - START TIME',
      dataIndex: 'start',
    },
    {
      title: 'END DATE - END TIME',
      dataIndex: 'end',
    },
    {
      title: 'DURATION',
      dataIndex: 'duration',
    },
    {
      title: 'PUBLISH',
      dataIndex: 'publish',
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      render: () => (
        <Button shape="circle" icon={<EllipsisOutlined />} className="border" />
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      className="rounded-lg overflow-hidden"
    />
  );
};

export default BannerTable;
