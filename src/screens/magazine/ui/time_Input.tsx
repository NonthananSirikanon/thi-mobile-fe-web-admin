// components/TimeInput.tsx
import React from 'react'
import { TimePicker } from 'antd'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import locale from 'antd/es/date-picker/locale/en_US'

interface TimeInputProps {
  label?: string
  value?: Dayjs
  onChange?: (time: Dayjs, timeString: string | string[]) => void
  required?: boolean
}

const TimeInput: React.FC<TimeInputProps> = ({ label = 'Start time', value, onChange, required }) => {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-black">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <TimePicker
        value={value}
        onChange={onChange}
        format="hh:mm A"
        use12Hours
        locale={locale}
        allowClear
        className="w-[200px] h-[52px] border border-gray-300 rounded-md px-4 py-2 shadow-sm"
        popupClassName="custom-timepicker-popup"
      />
    </div>
  )
}

export default TimeInput
