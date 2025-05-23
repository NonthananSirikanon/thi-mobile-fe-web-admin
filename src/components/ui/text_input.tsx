
import React, { useState } from 'react';
import { Input } from 'antd';

interface URLInputProps {
  initialValue?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  label?: string;
}

export const URLInput: React.FC<URLInputProps> = ({
  initialValue = '',
  onChange,
  placeholder = 'https://www.example.com',
  label = 'URL'
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-gray-700 font-medium">{label}</div>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="rounded border border-gray-300 w-full p-2"
      />
    </div>
  );
};
