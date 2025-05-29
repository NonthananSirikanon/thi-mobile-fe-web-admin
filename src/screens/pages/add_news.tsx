import { useState } from "react";
import UploadBanner from "../ui/banner_upload";
import type { UploadFile } from "antd";
import { HeadlineInput } from "../ui/text_input";
import BannerToggle from "../ui/switch";
import ActionButton from "../ui/actionbutton";
import RadioGroup from '../ui/radio_botton';
import { Editor } from 'primereact/editor';
import { CategoryDropdown, type CategoryValue } from "../ui/dropdown";

function AddNews() {
  const handleFileChange = (files: UploadFile[]) => {
    console.log("Files changed:", files);
  };
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CategoryValue | undefined>(undefined);



  function handleCategoryChange(value: CategoryValue): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-4">Add News</h1>

      <div className="md:basis-2/5 w-full h-full">
        <UploadBanner
          required={true}
          maxSize={5}
        />
      </div>
      <div className="">
        <RadioGroup required />
      </div>
      <div className="flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0">
        <div className="md:basis-2/6 w-full space-y-4">
            <CategoryDropdown
        value={category}
        onChange={handleCategoryChange}
        label="Select news type"
        placeholder="News Type"
      />
        </div>
        <div className="md:basis-4/6 w-full h-full">
          <HeadlineInput />
        </div>
      </div>

      <div className="card">
        <Editor value={text} onTextChange={(e) => setText(e.htmlValue ?? '')} style={{ height: '520px' }} />
      </div>
      
      {/* <div className="mt-4  flex justify-between">
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
      </div> */}

      <div className="">
        <BannerToggle
          checked={isBannerActive}
          onChange={(val) => setIsBannerActive(val)}
          showLabel={true} // เปลี่ยนเป็น false หากไม่ต้องการแสดงข้อความ
        />
        <div className="mt-16 flex justify-end gap-5 ">
          <div className="">
            <ActionButton
              type="cancel"
              onClick={() => console.log('Cancel clicked')}
            />
          </div>
          <div className="">
            <ActionButton
              type="save"
              onClick={() => console.log('Save clicked')}
            />
          </div>
        </div>

        {/* <div className="p-6 space-y-4 ">
          <button
        onClick={() => setShowAdd(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Add Confirm Dialog
      </button>

      <button
        onClick={() => setShowDelete(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Show Delete Confirm Dialog
      </button> */}

        {/* <UniversalDialog
        type="confirm"
        visible={showAdd}
        onCancel={() => setShowAdd(false)}
        onConfirm={() => {
          console.log('Item added');
          setShowAdd(false);
        }}
      /> */}

      </div>
    </div>
  );
}

export default AddNews;