import { useEffect, useState } from "react";
import UploadBanner from "../ui/banner_upload";
import { HeadlineInput } from "../ui/text_input";
import BannerToggle from "../ui/switch";
import ActionButton from "../ui/actionbutton";
import RadioGroup from "../ui/radio_botton";
import { Editor } from "primereact/editor";
import { CategoryDropdown, type CategoryValue } from "../ui/dropdown";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import NewsAdminLayout from "./add_news_layout";
import { fetchNewsById } from "../service/newsService";

function AddNews() {
  const { id } = useParams();
  const [title, setHeadline] = useState('');
  const [status, setIsBannerActive] = useState(false);
  const [content, setText] = useState('');
  const [category, setCategory] = useState<CategoryValue | undefined>();
  const [thumbnail, setBannerFile] = useState<File | null>(null);
  const DB_VERSION = 5;
  const [type, setNewsType] = useState<string>("");

  function dataURLToFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

  useEffect(() => {
  if (id) {
    const numericId = Number(id);
    
    const loadData = async () => {
      const db = await openDB();
      const tx = db.transaction("news-drafts", "readonly");
      const store = tx.objectStore("news-drafts");
      const request = store.get(numericId);

      request.onsuccess = async () => {
        const draft = request.result;

        if (draft) {
          // ✅ กรณีข้อมูลอยู่ใน IndexedDB
          setHeadline(draft.title);
          setCategory(draft.category);
          setText(draft.content);
          setIsBannerActive(draft.status);
          setNewsType(draft.type);

          if (draft.thumbnail) {
            const file = dataURLToFile(draft.thumbnail, "thumbnail.jpg");
            setBannerFile(file);
          }

        } else {
          try {
            // ✅ กรณีโหลดจาก API
            const apiNews = await fetchNewsById(numericId);
            setHeadline(apiNews.title);
            setCategory(apiNews.category?.categoryId || 0);
            setText(apiNews.content);
            setIsBannerActive(apiNews.status);
            setNewsType(apiNews.type);
            setBannerFile(null); // หรือแปลง URL ไป fetch Blob แล้วแปลงเป็น File ก็ได้

            // ✅ หากอยาก preload thumbnail จาก URL เป็น File:
            if (apiNews.thumbnail) {
              const res = await fetch(apiNews.thumbnail);
              const blob = await res.blob();
              const file = new File([blob], "thumbnail.jpg", { type: blob.type });
              setBannerFile(file);
            }
          } catch (err) {
            console.error("โหลดข่าวจาก API ล้มเหลว:", err);
          }
        }

        db.close();
      };
    };

    loadData();
  }
}, [id]);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setBannerFile(file);
    } else {
      setBannerFile(null);
    }
  };

  const openDB = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDB", DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("news-drafts")) {
          db.createObjectStore("news-drafts", { keyPath: "front_id" });
        }
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        const missingStores: string[] = [];
        if (!db.objectStoreNames.contains("news-drafts")) missingStores.push("news-drafts");
        if (!db.objectStoreNames.contains("images")) missingStores.push("images");

        if (missingStores.length > 0) {
          db.close();
          const newVersion = db.version + 1;

          const upgradeRequest = indexedDB.open("MyDB", newVersion);

          upgradeRequest.onupgradeneeded = () => {
            const upgradedDB = upgradeRequest.result;
            if (!upgradedDB.objectStoreNames.contains("news-drafts")) {
              upgradedDB.createObjectStore("news-drafts", { keyPath: "front_id" });
            }
            if (!upgradedDB.objectStoreNames.contains("images")) {
              upgradedDB.createObjectStore("images", { keyPath: "key" });
            }
          };

          upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
          upgradeRequest.onerror = () => reject(upgradeRequest.error);
        } else {
          resolve(db);
        }
      };

      request.onerror = () => reject(request.error);
    });



  const saveNewsToIndexedDB = async () => {
    const db = await openDB();

    const now = new Date().toISOString();

    const isEditMode = Boolean(id);
    const frontId = isEditMode ? parseInt(id!, 10) : Date.now();

    const newsData = {
      front_id: frontId,
      newsId: 0,
      title,
      categoryId: category ?? 0,
      agencyId: category ?? 0,
      content,
      status,
      thumbnail: null as string | null,
      type,
      createdAt: now,
      updatedAt: now,
      createdBy: 2,
      updatedBy: 2,
      deletedBy: 0,
    };

    return new Promise<void>((resolve, reject) => {
      const completeSave = () => {
        const tx = db.transaction("news-drafts", "readwrite");
        const store = tx.objectStore("news-drafts");

        const existingRequest = store.get(frontId);
        existingRequest.onsuccess = () => {
          const existing = existingRequest.result;
          if (existing) {
            newsData.createdAt = existing.createdAt;
            newsData.updatedAt = now;
          }

          store.put(newsData);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };

        existingRequest.onerror = () => reject(existingRequest.error);
      };

      if (thumbnail) {
        const reader = new FileReader();
        reader.onload = () => {
          newsData.thumbnail = reader.result as string;
          completeSave();
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(thumbnail);
      } else {
        completeSave();
      }
    });
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await saveNewsToIndexedDB();
      console.log("News draft saved to IndexedDB");
      navigate('/news');
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  return (
    <NewsAdminLayout>
      <div className="space-y-6">
        <div className="md:basis-2/5 w-full h-full">
          <UploadBanner
            required
            maxSize={5}
            onFileChange={handleFileChange}
            initialFile={thumbnail}
          />
        </div>

        <div>
          <RadioGroup
            required
            value={type}
            onChange={(value) => setNewsType(value)}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0">
          <div className="md:basis-2/6 w-full space-y-4">
            <CategoryDropdown
              value={category}
              onChange={setCategory}
              label="Select news type"
              placeholder="News Type"
            />
          </div>
          <div className="md:basis-4/6 w-full h-full">
            <HeadlineInput
              value={title}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <Editor
            value={content}
            onTextChange={(e) => setText(e.htmlValue ?? '')}
            style={{ height: '520px' }}
          />
        </div>

        <div>
          <BannerToggle
            checked={status}
            onChange={setIsBannerActive}
            showLabel
          />
          <div className="mt-16 flex justify-end gap-5">
            <ActionButton type="cancel" onClick={() => console.log('Cancel clicked')} />
            <ActionButton type="save" onClick={handleSave} />
          </div>
        </div>
    </div>
    </NewsAdminLayout>
  );
}

export default AddNews;
