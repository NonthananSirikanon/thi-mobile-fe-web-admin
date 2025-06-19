import { useEffect, useMemo, useState } from 'react';
import '../news.css';
import StatusToggle from '../ui/statustoggle';
import ActionButton from '../ui/actionbutton';
import { Link } from 'react-router-dom';
import { AntTable, type TableModel } from '../ui/table';
import SearchMenu from '../ui/search_menu';
import NewsTabSelector from '../ui/news_tab';
import { useNavigate } from 'react-router-dom';
import { fetchNewsFromAPI } from '../service/newsService';


async function getAllNewsFromIndexedDB(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDB', 5);

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
    const request = indexedDB.open('MyDB', 5);

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
  const [searchKeyword, setSearchKeyword] = useState('');

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
      .then((indexedNews) => {
        console.log('✅ ข่าวจาก IndexedDB:', indexedNews);
        setNewsList(indexedNews);
        return fetchNewsFromAPI();
      })
      .then((apiNews) => {
        console.log('✅ ข่าวจาก API:', apiNews);
        setNewsList((prev) => [...prev, ...apiNews]);
      })
      .catch((err) => {
        console.error('โหลดข่าวล้มเหลว:', err);
      });
  }, []);

  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const tabMatch =
        (selectedTab === 'hotNews' && item.type === 'Hotnews') ||
        (selectedTab === 'featureNews' && item.type === 'Featurenews');

      const statusMatch = item.status === isActive;

      return tabMatch && statusMatch;
    });
  }, [selectedTab, isActive, newsList]);

  const tableData: TableModel = {
    header: ['#', 'Status', 'Headline', 'Type', 'Created At', 'Updated At', 'Actions'],
    body: {
      data: filteredNews.map((item, index) => ({
        key: item.front_id || item.newsId,
        front_id: item.front_id,
        id: item.id || item.newsId,
        title: item.title || '',
        content: item.text || '',
        type: item.type || '',
        categoryId: item.category || 0,
        agencyId: item.agency || 0,
        text: [
          (index + 1).toString(),
          item.status?.toString() || 'false',
          item.thumbnail || '',
          item.createdBy?.toString() || '0',
          item.updatedBy?.toString() || '0',
          item.createdAt || '',
          item.updatedAt || '',
          item.title || '',
          `${item.publishDateTime || ''}`
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
          <StatusToggle checked={isActive}   onChange={(checked) => setIsActive(checked)} />
        </div>

        <div className="flex-grow flex justify-center items-center px-4">
          <SearchMenu onSearch={(keyword) => setSearchKeyword(keyword)} />
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
