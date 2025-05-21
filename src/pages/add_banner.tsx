import React, { useState } from 'react'
import BreadCrumbNavigation from '../components/ui/breadcrumb'
import ActionButton from '../components/ui/actionbutton'
import { Link } from 'react-router-dom'
import DateInput from '../components/ui/date_Input'
import dayjs, { Dayjs } from 'dayjs'
import TimeInput from '../components/ui/time_Input'

function AddBanner() {
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs('2024-12-31'));
    const [time, setTime] = useState<Dayjs | null>(dayjs())

    return (

    <div className="space-y-6">
      <BreadCrumbNavigation />


      <h1 className="text-xl font-semibold mb-4">Add Banner</h1>
      <div className="flex justify-between">
      <DateInput
        label="Start date"
        required
        value={startDate}
        onChange={(date) => setStartDate(date)}
      />
       <TimeInput
        label="Start time"
        value={time ?? undefined}
        onChange={(value) => setTime(value)}
        required
      />
      <DateInput
        label="End date"
        required
        value={startDate}
        onChange={(date) => setStartDate(date)}
      />
       <TimeInput
        label="End Time"
        value={time ?? undefined}
        onChange={(value) => setTime(value)}
        required
      />
      </div>
      {/* เพิ่มฟอร์มสำหรับการเพิ่ม Banner ที่นี่ */}
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter banner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="5"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Banner</label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded-md"
              accept="image/*"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Link to="/">
            <ActionButton
              type="cancel"
              onClick={() => console.log('Cancel clicked')}
            />
          </Link>
          {/* <ActionButton 
                type="save" 
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Save clicked');
                }} 
              /> */}
        </div>
      </form>

    </div>

  )
}

export default AddBanner