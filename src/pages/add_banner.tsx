import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import UploadBanner from "../components/ui/banner_upload";
import { URLInput } from "../components/ui/text_input";
import BannerToggle from "../components/ui/switch";
import ActionButton from "../components/ui/actionbutton";
import DurationInput from "../components/ui/duration_Input";
import UniversalDialog from "../components/ui/dialog";

const DB_NAME = 'BannerDB';
const DB_VERSION = 2;
const STORE_NAME = 'banners';

interface BannerData {
  front_id?: number;
  id: number;
  position: number;
  status: boolean;
  banner: string;
  url: string;
  createdBy: string;
  editedBy: string;
  createdAt: string;
  createdTime: string;
  updateAt: string;
  updateTime: string;
  duration: string;
  publishDate: string;
  publishTime: string;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'front_id', autoIncrement: true });
      store.createIndex('position', 'position', { unique: false });
    };
  });
};

const addBannerToDB = async (bannerData: BannerData): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(bannerData);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as number);
  });
};

const updateBannerInDB = async (bannerData: BannerData): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(bannerData);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

const getAllBannersFromDB = async (): Promise<BannerData[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
};

function AddBanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [duration, setDuration] = useState(5);
  const [url, setUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'edit') {
      setIsEditMode(true);
      
      const front_id = searchParams.get('front_id');
      const position = searchParams.get('position');
      const status = searchParams.get('status') === 'true';
      const banner = searchParams.get('banner');
      const urlParam = searchParams.get('url');
      const durationParam = searchParams.get('duration');
      const createdBy = searchParams.get('createdBy');
      const editedBy = searchParams.get('editedBy');
      const createdAt = searchParams.get('createdAt');
      const createdTime = searchParams.get('createdTime');
      const updateAt = searchParams.get('updateAt');
      const updateTime = searchParams.get('updateTime');
      const publishDate = searchParams.get('publishDate');
      const publishTime = searchParams.get('publishTime');

      setIsBannerActive(status);
      setUrl(urlParam || '');
      setDuration(parseInt(durationParam || '5'));
      
      if (banner && banner.startsWith('data:')) {
        try {
          const file = dataURLtoFile(banner, 'banner.jpg');
          setUploadedFiles([file]);
        } catch (error) {
          console.error('Error converting base64 to file:', error);
        }
      }
      
      const bannerData: BannerData = {
        front_id: front_id ? parseInt(front_id) : undefined,
        id: 0,
        position: parseInt(position || '1'),
        status: status,
        banner: banner || '',
        url: urlParam || '',
        createdBy: createdBy || 'Current User',
        editedBy: editedBy || 'Current User',
        createdAt: createdAt || '',
        createdTime: createdTime || '',
        updateAt: updateAt || '',
        updateTime: updateTime || '',
        duration: durationParam ? `${durationParam}(s)` : '5(s)',
        publishDate: publishDate || '',
        publishTime: publishTime || '',
      };
      
      setEditingBanner(bannerData);
    }
  }, [searchParams]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return { date, time };
  };

  const handleConfirmAdd = async () => {
    try {
      const { date, time } = getCurrentDateTime();
      
      let bannerBase64 = '';
      if (uploadedFiles.length > 0) {
        const file = uploadedFiles[0];
        bannerBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (isEditMode && editingBanner) {
        const updatedBannerData: BannerData = {
          ...editingBanner,
          status: isBannerActive,
          banner: bannerBase64 || editingBanner.banner,
          url: url || '-',
          editedBy: 'Current User',
          updateAt: date,
          updateTime: time,
          duration: `${duration}(s)`,
        };

        await updateBannerInDB(updatedBannerData);
        console.log('Banner updated successfully');
        
      } else {
        const existingBanners = await getAllBannersFromDB();
        const nextPosition = existingBanners.length + 1;

        const bannerData: BannerData = {
          id: 0,
          position: nextPosition,
          status: isBannerActive,
          banner: bannerBase64 || 'banner',
          url: url || '-',
          createdBy: 'Current User',
          editedBy: 'Current User',
          createdAt: date,
          createdTime: time,
          updateAt: date,
          updateTime: time,
          duration: `${duration}(s)`,
          publishDate: date,
          publishTime: time,
        };

        const front_id = await addBannerToDB(bannerData);
        console.log('Banner added successfully with front_id:', front_id);
      }
      
      resetForm();
      
      navigate('/');
      
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const resetForm = () => {
    setUrl('');
    setUploadedFiles([]);
    setDuration(5);
    setIsBannerActive(false);
    setShowAdd(false);
    setIsEditMode(false);
    setEditingBanner(null);
  };

  const handleCancel = () => {
    resetForm();
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-4">
        {isEditMode ? 'Edit Banner' : 'Add Banner'}
      </h1>
      
      <UploadBanner
        title="Upload banner"
        required={true}
        maxSize={10}
        supportedFormats={["jpg","jpeg","png","svg"]}
        onFileChange={(files) => {
          console.log("ไฟล์ที่เลือก:", files);
          setUploadedFiles(files);
        }}
        initialFiles={uploadedFiles}
      />

      <URLInput 
        value={url}
        onChange={setUrl}
      />

      <div className="mt-4 flex justify-between">
        <DurationInput 
          value={duration} 
          onChange={setDuration} 
          required 
        />
      </div>

      <div className="">
        <BannerToggle
          checked={isBannerActive}
          onChange={(val) => setIsBannerActive(val)}
          showLabel={true}
        />
        
        <div className="mt-4 flex justify-end gap-5">
          <div className="">
            <ActionButton
              type="cancel"
              onClick={handleCancel}
            />
          </div>
          <div className="">
            <ActionButton
              type={isEditMode ? "update" : "save"}
              onClick={() => setShowAdd(true)}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <UniversalDialog
            type="confirm"
            visible={showAdd}
            onCancel={() => setShowAdd(false)}
            onConfirm={handleConfirmAdd}
            title={isEditMode ? "Edit Item Confirmation" : "Add Item Confirmation"}
          />
        </div>
      </div>
    </div>
  );
}

export default AddBanner;