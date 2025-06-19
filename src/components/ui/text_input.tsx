import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

interface URLInputProps {
  initialValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  placeholder?: string;
  label?: string;
}

export const URLInput: React.FC<URLInputProps> = ({
  initialValue = '',
  value,
  onChange,
  placeholder = 'https://www.example.com', 
  label = 'URL'
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);

  const [error, setError] = useState(false);

  // ตรวจ URL ด้วย regex
  const validateURL = (url: string) => {
    return /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url);
  };

  // อัปเดตเมื่อ props.value เปลี่ยน
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
      setError(!validateURL(value));
    }
  }, [value]);

  // ตรวจค่าที่รับมาตอนเริ่มต้น
  useEffect(() => {
    if (initialValue && value === undefined) {
      setError(!validateURL(initialValue));
    }
  }, [initialValue, value]);

  // ตรวจ URL ขณะพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    const isValid = validateURL(newValue);
    setError(!isValid);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-gray-700 font-medium">{label}</label>}
      <Input
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`h-[52px] ${error ? 'border-red-500' : 'border-gray-300'}`}
        status={error ? 'error' : undefined}
      />
      {error && (
        <div className="mt-1 text-sm text-red-500">
          The URL entered is not in the correct format. Please ensure it begins with 'http://' or 'https://'  and try again.
        </div>
      )}
    </div>
  );
};