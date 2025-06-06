import { useEffect, useMemo, useState } from 'react';
import './news.css';
import StatusToggle from './ui/statustoggle';
import ActionButton from './ui/actionbutton';
import { Link } from 'react-router-dom';
import { AntTable, type TableModel } from './ui/table';
import SearchMenu from './ui/search_menu';
import NewsTabSelector from './ui/news_tab';
import { useNavigate } from 'react-router-dom';


// 👇 helper ฟังก์ชันอ่านจาก IndexedDB
async function getAllNewsFromIndexedDB(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDB', 2);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('news-drafts', 'readonly');
      const store = tx.objectStore('news-drafts');
      const getAll = store.getAll();

      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => reject(getAll.error);
    };
  });
}

export const deleteNewsFromIndexedDB = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDB', 2);

    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction(['news-drafts'], 'readwrite');
      const objectStore = transaction.objectStore('news-drafts');
      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

function NewsPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'hotNews' | 'featureNews'>('hotNews');
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/addnews/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNewsFromIndexedDB(id);
      const newList = newsList.filter((item) => item.id.toString() !== id.toString());
      setNewsList(newList);
    } catch (error) {
      console.error('ลบข่าวไม่สำเร็จ:', error);
    }
  };


  useEffect(() => {
    getAllNewsFromIndexedDB()
      .then((news) => {
        console.log("✅ ข่าวจาก IndexedDB:", news);
        setNewsList(news);
      })
      .catch((err) => console.error('Failed to load news from IndexedDB:', err));
  }, []);

  const filteredNews = useMemo(() => {
  return newsList.filter((item) => {
    if (selectedTab === 'hotNews') return item.newsType === 'HotNews';
    if (selectedTab === 'featureNews') return item.newsType === 'FeatureNews';
    return true;
  });
}, [selectedTab, newsList]);



  const tableData: TableModel = {
    header: ['#', 'Status', 'Headline', 'Type', 'Created At', 'Updated At', 'Actions'],
    body: {
      data: filteredNews.map((item, index) => ({
        key: item.id,
        id: item.id,
        headline: item.headline || '',
        textDetail:  item.text || '',
        newsType:  item.newsType || '',
        text: [
          (index + 1).toString(),   
          item.isBannerActive?.toString() || '',
          item.bannerFile || '',              
          item.createdBy || 'Admin',     
          item.lastEditedBy || 'Editor',
          item.createdAt || '',
          item.updatedAt || '',
          item.headline || '',          
          '',                                    
          `${item.publishDate || '2024-12-31'} ${item.publishTime || '20:00'}`
        ],

        function: {
          onClick: () => console.log('Clicked:', item.id),
        }
      }))
    }
  };

  return (
    <div className="space-y-6">
      <div className="mt-4">
        <NewsTabSelector selected={selectedTab} onChange={setSelectedTab} />
      </div>

      <div className="flex justify-between items-center p-4 w-full">
        <div className="flex-none">
          <StatusToggle checked={isActive} onChange={setIsActive} />
        </div>

        <div className="flex-grow flex justify-center items-center px-4">
          <SearchMenu />
        </div>

        <div className="flex flex-wrap gap-4 justify-end flex-none">
          <Link to="/addnews">
            <ActionButton type="addBanner" onClick={() => console.log('Add Banner clicked')} />
          </Link>
          <ActionButton type="publish" onClick={() => console.log('Publish clicked')} />
        </div>
      </div>

      <div>
        <AntTable
          body={tableData.body}
          onEdit={(record) => handleEdit(record.key)}
          onDelete={(record) => handleDelete(record.key)}
        />
      </div>
    </div>
  );
}

export default NewsPage;
