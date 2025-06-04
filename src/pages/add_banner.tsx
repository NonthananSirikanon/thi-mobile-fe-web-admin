import { useState } from "react";
// import DateInput from "../components/ui/date_Input";
// import dayjs, { Dayjs } from "dayjs";
// import TimeInput from "../components/ui/time_Input";
import UploadBanner from "../components/ui/banner_upload";
import { URLInput } from "../components/ui/text_input";
// import NoExpirationCheckbox from "../components/ui/checkbox";
import BannerToggle from "../components/ui/switch";
import ActionButton from "../components/ui/actionbutton";
import DurationInput from "../components/ui/duration_Input";
import UniversalDialog from "../components/ui/dialog";

//import UniversalDialog from "../components/ui/dialog";

function AddBanner() {
  // const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
  //   dayjs("2024-12-31")
  // );
  // const [time, setTime] = useState<Dayjs | null>(dayjs());

  //const [noExpire, setNoExpire] = useState(false);
  const [isBannerActive, setIsBannerActive] = useState(false);

    const [showAdd, setShowAdd] = useState(false);
     //const [showDelete, setShowDelete] = useState(false);
      // const [dialogOpen, setDialogOpen] = useState(false);

  
  const [duration, setDuration] = useState(5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-4">Add Banner</h1>
      <UploadBanner
        title="Upload banner" // ชื่อที่แสดง
        required={true} // บังคับกรอก (แสดง *)
        maxSize={10} // ขนาดไฟล์สูงสุด (MB)
        supportedFormats={["jpg","jpeg","png","svg"]} // ประเภทไฟล์ที่รองรับ
        onFileChange={(files) => {
          // ฟังก์ชันเมื่อมีการเปลี่ยนไฟล์
          console.log("ไฟล์ที่เลือก:", files);
        }}
      />

      <URLInput />
       {/* <NoExpirationCheckbox
        checked={noExpire}
        onChange={(value) => setNoExpire(value)}
      />  */}
      <div className="mt-4  flex justify-between">
        {/* <DateInput
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
        /> */}
        <DurationInput value={duration} onChange={setDuration} required />
      </div>

      <div className="">
        <BannerToggle
          checked={isBannerActive}
          onChange={(val) => setIsBannerActive(val)}
          showLabel={true}
        />
        <div className="mt-4 flex justify-end gap-5 ">
          <div className="">
            <ActionButton
              type="cancel"
              onClick={() => console.log("Cancel clicked")}
            />
          </div>
          <div className="">
            <ActionButton
              type="save"
              onClick={() => setShowAdd(true)}
            />
          </div>
        </div>
         <div className="p-6 space-y-4 ">
          {/* <button
        onClick={() => setShowAdd(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Add Confirm Dialog
      </button> */}
      

      {/* <button
        onClick={() => setShowDelete(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Show Delete Confirm Dialog
      </button>   */}

        <UniversalDialog
        type="confirm"
        visible={showAdd}
        onCancel={() => setShowAdd(false)}
        onConfirm={() => {
          console.log('Item added');
          setShowAdd(false);
        }}
      /> 
         {/* <button
        onClick={() => setDialogOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Preview All Banners
      </button>  */}

         {/* <UniversalDialog
        type="previewBanner"
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        bannerImages={banners}
      />  */}
        </div>
      </div>
    </div>
  );
}

export default AddBanner;
