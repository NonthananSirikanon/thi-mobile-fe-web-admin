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

  const loadBannersFromDB = async () => {
    try {
      const banners = await getAllBannersFromDB();

      if (banners.length > 0) {
        const formattedBanners = banners.map((banner) => ({
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

        setTableData({
          header: ['Position', 'Status', 'Banner', 'URL', 'Created By', 'Edited By', 'Start Date', 'End Date', 'Duration', 'Publish Date', 'Actions'],
          body: {
            data: formattedBanners
          }
        });
        setBannerImages(banners.map(banner => banner.banner));
      } else {
        setBannerImages([]);
      }
    } catch (error) {
      console.error('Error loading banners from DB:', error);
    }
  };

  const refreshTableData = async () => {
    try {
      const banners = await getAllBannersFromDB();

      const formattedBanners = banners.map((banner) => ({
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

      setTableData(prev => ({
        ...prev,
        body: {
          data: formattedBanners
        }
      }));
      setBannerImages(banners.map(banner => banner.banner));
    } catch (error) {
      console.error('Error refreshing table data:', error);
    }
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
        <StatusToggle checked={isActive} onChange={setIsActive} />
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
      
      <nav className="mt-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700 mr-2">Home</Link> |
        <Link to="/addbanner" className="text-blue-500 hover:text-blue-700 ml-2">Add Banner</Link>
      </nav>

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