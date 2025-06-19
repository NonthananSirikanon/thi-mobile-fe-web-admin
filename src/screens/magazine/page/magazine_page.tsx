import { useEffect, useMemo, useState } from 'react';
import '../magazine.css';
import StatusToggle from '../ui/statustoggle';
import ActionButton from '../ui/actionbutton';
import { Link } from 'react-router-dom';
import { AntTable, type TableModel } from '../ui/table';
import SearchMenu from '../ui/search_menu';
import { useNavigate } from 'react-router-dom';

async function getAllNewsFromIndexedDB(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyDB', 5);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('magazine-drafts', 'readonly');
      const store = tx.objectStore('magazine-drafts');
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
      const transaction = db.transaction(['magazine-drafts'], 'readwrite');
      const objectStore = transaction.objectStore('magazine-drafts');
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

function MagazinePage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();

  const handleEdit = (front_id: string) => {
    navigate(`/addMagazine/${front_id}`);
  };

  const handleDelete = async (front_id: string) => {
    try {
      await deleteNewsFromIndexedDB(front_id);
      const newList = newsList.filter((item) => item.front_id.toString() !== front_id.toString());
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
  return newsList.filter(() => {
    return true;
  });
}, [newsList]);

  const tableData: TableModel = {
    header: ['#', 'Status', 'Cover Image', 'Issue Number','Created By', 'Last Edited By', 'Created At','Update At' , 'Reading Volume','Likes' ,'Comments' ,'Shares' ,'Publish', 'Actions'],
    body: {
      data: filteredNews.map((item, index) => ({
        key: item.front_id,
        front_id: item.front_id,
        id: item.id,
        title: item.title || '',
        pdfMagazine:  item.pdfMagazine || '',
        text: [
          (index + 1).toString(),   
          item.isBannerActive?.toString() || '',
          item.bannerFile || '',            
          item.issueNum || '',  
          item.createdBy || 'Admin',     
          item.lastEditedBy || 'Admin',
          item.createdAt || '',
          item.updatedAt || '',
          item.readVolume || 0,
          item.likes || 0,
          item.comments || 0,
          item.shares || 0,
          item.publishAt || '',
        ],

        function: {
          onClick: () => console.log('Clicked:', item.id),
        }
      }))
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center p-4 w-full">
        <div className="flex-none">
          <StatusToggle checked={isActive} onChange={setIsActive} />
        </div>

        <div className="flex-grow flex justify-center items-center px-4">
          <SearchMenu />
        </div>

        <div className="flex flex-wrap gap-4 justify-end flex-none">
          <Link to="/addMagazine">
            <ActionButton type="addNewIssue" onClick={() => console.log('Add Banner clicked')} />
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

export default MagazinePage;
