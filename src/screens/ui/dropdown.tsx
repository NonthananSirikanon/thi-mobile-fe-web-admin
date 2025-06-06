// src/components/Dropdown.tsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export type CategoryValue =
  | 'politics'
  | 'business'
  | 'technology'
  | 'health'
  | 'sports'
  | 'entertainment'
  | 'education'
  | 'world'
  | 'local'
;

type OptionType = {
  label: string;
  value: CategoryValue;
};

type DropdownProps = {
  value?: CategoryValue;
  onChange: (value: CategoryValue) => void;
  label?: string;
  placeholder?: string;
};

export const categoryOptions: OptionType[] = [
  { label: 'Politics', value: 'politics' },
  { label: 'Business', value: 'business' },
  { label: 'Technology', value: 'technology' },
  { label: 'Health', value: 'health' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Education', value: 'education' },
  { label: 'World', value: 'world' },
    { label: 'Local', value: 'local' },
];

export const CategoryDropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  label = 'News Category',
  placeholder = 'Select a category',
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 text-gray-700 font-medium">{label}</div>
      <Select
        value={value}
        onChange={(val) => onChange(val as CategoryValue)}
        placeholder={placeholder}
        style={{ width: '100%', height: 52 }}
      >
        {categoryOptions.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};
