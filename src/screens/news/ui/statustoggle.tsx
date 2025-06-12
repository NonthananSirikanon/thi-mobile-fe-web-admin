import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

type StatusToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

const StatusToggle: React.FC<StatusToggleProps> = ({ checked, onChange, label = 'Active' }) => {
  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    onChange(e.target.checked);
  };

  return (
    <div className="">
    <div
      className={`flex items-center px-3 py-2 rounded-[4px] border text-sm font-medium transition-all
        ${checked ? 'bg-blue-100 border-blue-400 text-blue-600' : 'bg-white border-gray-300 text-blue-500'}`}
    >
      <Checkbox
        checked={checked}
        onChange={handleCheckboxChange}
        className=""
      />
      <span className='ml-3'>{label}</span>
    </div>
    </div>
  );
};

export default StatusToggle;
