import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState(false);

  // ตรวจ URL ด้วย regex
  const validateURL = (url: string) => {
    return /^https?:\/\/[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url);
  };

  // ตรวจแบบไดนามิกเมื่อพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    const isValid = validateURL(newValue);
    setError(!isValid);
    if (onChange) onChange(newValue);
  };

  // ตรวจค่าที่รับมาตอนเริ่มต้น
  useEffect(() => {
    if (initialValue) {
      setError(!validateURL(initialValue));
    }
  }, [initialValue]);

  return (
    <div className="w-full">
      {label && <label className="block text-gray-700 font-medium">{label}</label>}
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`h-[52px] ${error ? 'border-red-500' : 'border-gray-300'}`}
        status={error ? 'error' : undefined}
      />
      {error && (
        <div className="mt-1 text-sm text-red-500">
          The URL entered is not in the correct format. Please ensure it begins with 'http://' or 'https://' and try again.
        </div>
      )}
    </div>
  );
};
