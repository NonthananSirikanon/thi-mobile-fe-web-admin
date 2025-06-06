
import React, { useState } from 'react';
import { Input } from 'antd';

interface TextInput {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
}

export const HeadlineInput: React.FC<TextInput> = ({
  value,
  onChange,
  placeholder = 'Enter your headlines',
  label = 'Headlines'
}) => {
  return (
    <div className="w-full">
      <div className="mb-2 text-gray-700 font-medium">{label}</div>
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