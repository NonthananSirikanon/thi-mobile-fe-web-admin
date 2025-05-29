import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchMenu: React.FC = () => (
    <Input
      placeholder="Search"
      style={{ width: '100%' }}
      addonBefore={<SearchOutlined />}
      allowClear
    />
);

export default SearchMenu;