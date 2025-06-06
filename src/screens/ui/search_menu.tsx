import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchMenu: React.FC = () => (
    <Input
      placeholder="Search"
      style={{ width: '80%'}}
      addonBefore={<SearchOutlined />}
      allowClear
      size="large" 
    />
);

export default SearchMenu;