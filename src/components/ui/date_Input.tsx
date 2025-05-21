// components/ui/DateInput.tsx
import React from 'react';
import { DatePicker, type DatePickerProps } from 'antd';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/th';
import locale from 'antd/es/date-picker/locale/en_GB';

interface DateInputProps {
  label: string;
  required?: boolean;
  value?: Dayjs | null
  onChange?: DatePickerProps['onChange'];
}

const DateInput: React.FC<DateInputProps> = ({ label, required = false, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block font-bold mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <DatePicker
        locale={locale}
        value={value}
        onChange={onChange}
        format="DD/MM/YYYY"
        className="w-[200px] h-[52px] border border-gray-300 rounded-md px-4 py-2 "
        popupClassName="custom-datepicker-popup"
        allowClear
      />
    </div>
  );
};

export default DateInput;
