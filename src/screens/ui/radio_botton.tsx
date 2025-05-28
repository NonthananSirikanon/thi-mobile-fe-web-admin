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
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name = 'radio-group',
  required = false,
  options = [
    { label: 'Hot News', value: 'HotNews' },
    { label: 'Feature News', value: 'FeatureNews' },
  ],
  defaultValue = '',
  onChange,
  label = 'Topic',
}) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="w-full">
      {label && <div className="mb-2 text-gray-700 font-medium">{label}</div>}
      <div className="flex gap-6 px-3 py-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
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
