import React from 'react';

interface RadioOption {
  label: string;
  value: string;
  required?: boolean;
}

interface RadioGroupProps {
  name?: string;
  required?: boolean;
  options?: RadioOption[];
  value?: string; // <-- แทน defaultValue
  onChange?: (value: string) => void;
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name = 'radio-group',
  required = false,
  options = [
    { label: 'Hot News', value: 'HotNews' },
    { label: 'Feature News', value: 'FeatureNews' },
  ],
  value = '', // ← ใช้จาก parent component
  onChange,
  label = 'Topic',
}) => {
  const handleChange = (val: string) => {
    if (onChange) onChange(val);
  };

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-gray-700 font-medium">{label}</div>}
      <div className="flex gap-6">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value} // ← ควบคุมจาก props.value
              onChange={() => handleChange(option.value)}
              required={required}
              className="form-radio text-blue-600 w-4 h-4"
            />
            <span className="text-sm text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
