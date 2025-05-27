import React from 'react';
import { Input, Typography } from 'antd';

const { Text } = Typography;

interface DurationInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
}

const DurationInput: React.FC<DurationInputProps> = ({
  label = 'Duration',
  value,
  onChange,
  min = 3,
  max = 10,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = Number(e.target.value);
    if (!isNaN(inputVal) && inputVal >= min && inputVal <= max) {
      onChange(inputVal);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Text strong className="text-black">
        {label} {min}-{max} seconds
        {required && <span className="text-red-500 ml-1">*</span>}
      </Text>
      <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 w-fit">
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          bordered={false}
          className=" w-[200px] h-[35px] border-none shadow-none p-0 focus:!ring-0 focus:!outline-none text-black"
        />
        <span className="ml-2 text-gray-400 text-base">Second</span>
      </div>
    </div>
  );
};

export default DurationInput;
