// components/ui/TextInput.tsx
import React from 'react';
import { Input } from 'antd';

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = '',
  label = '',
  required = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ height: 52 }}
        className="rounded border border-gray-300 w-full p-2"
      />
    </div>
  );
};
