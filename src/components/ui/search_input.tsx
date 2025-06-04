// src/components/SearchInput.tsx
import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search",
  onSearch,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Input
        size="large"
        allowClear
        placeholder={placeholder}
        prefix={<SearchOutlined className="text-gray-400" />}
        onChange={(e) => onSearch(e.target.value)}
        onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
        className="rounded-lg border border-gray-300 focus:border-blue-500 focus:shadow-md transition duration-200"
      />
    </div>
  );
};

export default SearchInput;
