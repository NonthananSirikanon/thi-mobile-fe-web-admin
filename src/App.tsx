import { useState, useEffect } from 'react';
import './App.css';
import StatusToggle from './components/ui/statustoggle';
import ActionButton from './components/ui/actionbutton';
import { Link } from 'react-router-dom';
import { AntTable, type TableModel } from './components/ui/table';
import SearchInput from './components/ui/search_input';
import UniversalDialog from './components/ui/dialog';

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

function App() {
  const [isActive, setIsActive] = useState(true);
  const [allBanners, setAllBanners] = useState<BannerData[]>([]); // เก็บข้อมูลทั้งหมด
  const [tableData, setTableData] = useState<TableModel>({
    header: ['Position', 'Status', 'Banner', 'URL', 'Created By', 'Edited By', 'Start Date', 'End Date', 'Duration', 'Publish Date', 'Actions'],
    body: {
      data: [] 
    }
  });
  const [isPreviewDialogVisible, setIsPreviewDialogVisible] = useState(false);
  const [isPublishDialogVisible, setIsPublishDialogVisible] = useState(false);
  const [bannerImages, setBannerImages] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    console.log("ค้นหา:", value);
  };

  // ฟังก์ชันสำหรับกรองข้อมูลตามสถานะ
  const filterBannersByStatus = (banners: BannerData[], showActiveOnly: boolean) => {
    if (showActiveOnly) {
      return banners.filter(banner => banner.status === true);
    }
    return banners; // แสดงทั้งหมดถ้าไม่เลือก Active
  };

  // ฟังก์ชันสำหรับแปลงข้อมูลเป็นรูปแบบที่ table ใช้
  const formatBannersForTable = (banners: BannerData[]) => {
    return banners.map((banner) => ({
      text: [
        banner.position.toString(),
        banner.status ? 'true' : 'false',
        banner.banner,
        banner.url,
        banner.createdBy,
        banner.editedBy,
        `${banner.createdAt} ${banner.createdTime}`,
        `${banner.updateAt} ${banner.updateTime}`,
        banner.duration,
        `${banner.publishDate} ${banner.publishTime}`,
        banner.front_id?.toString() || ''
      ],
      function: { onClick: () => console.log('Action clicked for banner front_id:', banner.front_id, 'id:', banner.id) }
    }));
  };

  // ฟังก์ชันสำหรับอัพเดต table data
  const updateTableData = (banners: BannerData[]) => {
    const filteredBanners = filterBannersByStatus(banners, isActive);
    const formattedBanners = formatBannersForTable(filteredBanners);

    setTableData({
      header: ['Position', 'Status', 'Banner', 'URL', 'Created By', 'Edited By', 'Start Date', 'End Date', 'Duration', 'Publish Date', 'Actions'],
      body: {
        data: formattedBanners
      }
    });
    
    // อัพเดต bannerImages สำหรับ preview (ใช้ข้อมูลที่กรองแล้ว)
    setBannerImages(filteredBanners.map(banner => banner.banner));
  };

  const loadBannersFromDB = async () => {
    try {
      const banners = await getAllBannersFromDB();
      setAllBanners(banners); // เก็บข้อมูลทั้งหมด
      updateTableData(banners); // อัพเดต table ด้วยข้อมูลที่กรองแล้ว
    } catch (error) {
      console.error('Error loading banners from DB:', error);
      setAllBanners([]);
      setBannerImages([]);
    }
  };

  const refreshTableData = async () => {
    try {
      const banners = await getAllBannersFromDB();
      setAllBanners(banners); // อัพเดตข้อมูลทั้งหมด
      updateTableData(banners); // อัพเดต table ด้วยข้อมูลที่กรองแล้ว
    } catch (error) {
      console.error('Error refreshing table data:', error);
    }
  };

  // ฟังก์ชันจัดการเมื่อเปลี่ยนสถานะ StatusToggle
  const handleStatusToggleChange = (checked: boolean) => {
    setIsActive(checked);
    // อัพเดต table ทันทีด้วยข้อมูลที่มีอยู่
    updateTableData(allBanners);
  };

  const handlePreviewAll = () => {
    setIsPreviewDialogVisible(true);
  };

  const handlePublish = () => {
    setIsPublishDialogVisible(true);
  };

  const handlePublishConfirm = () => {
    console.log('Publish confirmed');
    setIsPublishDialogVisible(false);
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewDialogVisible(false);
  };

  const handleClosePublishDialog = () => {
    setIsPublishDialogVisible(false);
  };

  // Effect สำหรับกรองข้อมูลเมื่อ isActive เปลี่ยน
  useEffect(() => {
    if (allBanners.length > 0) {
      updateTableData(allBanners);
    }
  }, [isActive]);

  useEffect(() => {
    loadBannersFromDB();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshTableData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleFocus = () => {
      refreshTableData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-end">
        <StatusToggle 
          checked={isActive} 
          onChange={handleStatusToggleChange}
          label="Active"
        />
        <SearchInput onSearch={handleSearch} />
        
        <Link to="/addbanner">
          <ActionButton
            type="addBanner"
            onClick={() => console.log('Add Banner clicked')}
          />
        </Link>
        <ActionButton
          type="previewAll"
          onClick={handlePreviewAll}
        />
        <ActionButton
          type="publish"
          onClick={handlePublish}
        />
      </div>
      
      <div className="">
        <AntTable {...tableData} />
      </div>

      <UniversalDialog
        type="previewBanner"
        visible={isPreviewDialogVisible}
        onCancel={handleClosePreviewDialog}
        bannerImages={bannerImages}
      />

      <UniversalDialog
        type="publish"
        visible={isPublishDialogVisible}
        onCancel={handleClosePublishDialog}
        onConfirm={handlePublishConfirm}
        tableData={tableData}
      />
    </div>
  );
}

export default App;