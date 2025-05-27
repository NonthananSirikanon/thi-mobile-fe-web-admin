import React, { useState } from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  name?: string;
  required?: boolean;
  options?: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function RadioGroup({
  name = 'radio-group',
  required = false,
  options = [
    { label: 'Hot News', value: 'HotNews' },
    { label: 'Feature News', value: 'FeatureNews' },
  ],
  defaultValue = '',
  onChange,
}: RadioGroupProps) {
  const [selected, setSelected] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="flex flex-row items-center space-x-6">
      {options.map((option) => (
        <label
          key={option.value}
          className="inline-flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleChange(option.value)}
            className="form-radio text-blue-600 w-5 h-5"
            required={required}
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
