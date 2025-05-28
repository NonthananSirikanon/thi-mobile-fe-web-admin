// src/components/Dropdown.tsx
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export type CategoryValue =
  | 'general'
  | 'breaking'
  | 'politics'
  | 'economy'
  | 'world'
  | 'crime'
  | 'society'
  | 'regional'
  | 'environment'
  | 'education'
  | 'technology'
  | 'health'
  | 'entertainment'
  | 'sports'
  | 'lifestyle'
  | 'travel'
  | 'automotive'
  | 'real_estate'
  | 'religion'
  | 'culture';

type OptionType = {
  label: string;
  value: CategoryValue;
};

type DropdownProps = {
  value: CategoryValue;
  onChange: (value: CategoryValue) => void;
  label?: string;
  placeholder?: string;
};

export const categoryOptions: OptionType[] = [
  { label: 'ข่าวทั่วไป', value: 'general' },
  { label: 'ข่าวด่วน', value: 'breaking' },
  { label: 'ข่าวการเมือง', value: 'politics' },
  { label: 'ข่าวเศรษฐกิจ', value: 'economy' },
  { label: 'ข่าวต่างประเทศ', value: 'world' },
  { label: 'ข่าวอาชญากรรม', value: 'crime' },
  { label: 'ข่าวสังคม', value: 'society' },
  { label: 'ข่าวภูมิภาค', value: 'regional' },
  { label: 'ข่าวสิ่งแวดล้อม', value: 'environment' },
  { label: 'ข่าวการศึกษา', value: 'education' },
  { label: 'ข่าวเทคโนโลยี', value: 'technology' },
  { label: 'ข่าวสุขภาพ', value: 'health' },
  { label: 'ข่าวบันเทิง', value: 'entertainment' },
  { label: 'ข่าวกีฬา', value: 'sports' },
  { label: 'ข่าวไลฟ์สไตล์', value: 'lifestyle' },
  { label: 'ข่าวท่องเที่ยว', value: 'travel' },
  { label: 'ข่าวยานยนต์', value: 'automotive' },
  { label: 'ข่าวอสังหาริมทรัพย์', value: 'real_estate' },
  { label: 'ข่าวศาสนา', value: 'religion' },
  { label: 'ข่าววัฒนธรรม', value: 'culture' },
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
