import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

type Props = {
  onSearch: (value: string) => void;
};

function SearchMenu({ onSearch }: Props) {
  return (
    <Input
      placeholder="Search"
      style={{ width: '80%' }}
      addonBefore={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      allowClear
      size="large" />
  );
}

export default SearchMenu;