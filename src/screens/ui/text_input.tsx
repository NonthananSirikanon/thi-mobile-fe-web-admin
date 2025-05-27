
import React, { useState } from 'react';
import { Input } from 'antd';

interface TextInput {
  initialValue?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  label?: string;
}

export const HeadlineInput: React.FC<TextInput> = ({
  initialValue = '',
  onChange,
  placeholder = 'Enter your headlines',
  label = 'Headlines'
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
        style={{ height: 52 }}
        className="rounded border border-gray-300 w-full p-2"
      />
    </div>
  );
};

  export const DetailInput: React.FC<TextInput> = ({
  initialValue = '',
  onChange,
  placeholder = 'Enter your news details',
  label = 'Details'
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
        style={{ height: 130 }}
        className="rounded border border-gray-300 w-full p-2"
      />
    </div>
  );
};
