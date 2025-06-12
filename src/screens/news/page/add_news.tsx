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
import NewsAdminMenu from "../ui/news_menu";
import NewsAdminLayout from "./add_news_layout";

function AddNews() {
  const { id } = useParams();
  const [headline, setHeadline] = useState('');
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [text, setText] = useState('');
  const [category, setCategory] = useState<CategoryValue | undefined>();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const DB_VERSION = 2;
  const [newsType, setNewsType] = useState<string>("");

  useEffect(() => {
  if (id) {
    const loadNewsDraft = async () => {
      const db = await openDB();
      const tx = db.transaction("news-drafts", "readonly");
      const store = tx.objectStore("news-drafts");
      const request = store.get(Number(id)); 

      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          setHeadline(data.headline);
          setCategory(data.category);
          setText(data.text);
          setIsBannerActive(data.isBannerActive);
          setNewsType(data.newsType);

          if (data.bannerFile) {
            fetch(data.bannerFile)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
                setBannerFile(file);
              });
          }
        }
        db.close();
      };
    };

    loadNewsDraft();
  }
}, [id]);

  // แทนที่ saveImageToIndexedDB() และ openDBAndLoadImage() ให้ใช้ openDB()


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
          db.createObjectStore("news-drafts", { keyPath: "id" });
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
          // ต้องเพิ่ม version ทีละ 1 จาก db.version (เช่น 2 เป็น 3)
          db.close();
          const newVersion = db.version + 1;

          const upgradeRequest = indexedDB.open("MyDB", newVersion);

          upgradeRequest.onupgradeneeded = () => {
            const upgradedDB = upgradeRequest.result;
            if (!upgradedDB.objectStoreNames.contains("news-drafts")) {
              upgradedDB.createObjectStore("news-drafts", { keyPath: "id" });
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

    const now = new Date().toISOString(); // วันที่และเวลาปัจจุบัน

    const newsId = id ? parseInt(id, 10) : Date.now();

    const newsData = {
      id: newsId,
      headline,
      category: category ?? '',
      text,
      isBannerActive,
      bannerFile: null as string | null,
      newsType,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise<void>((resolve, reject) => {
      const completeSave = () => {
        const tx = db.transaction("news-drafts", "readwrite");
        const store = tx.objectStore("news-drafts");

        const existingRequest = store.get(newsData.id);
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

        existingRequest.onerror = () => {
          reject(existingRequest.error);
        };
      };

      if (bannerFile) {
        const reader = new FileReader();
        reader.onload = () => {
          newsData.bannerFile = reader.result as string;
          completeSave();
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(bannerFile);
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
    <div className="space-y-6">
      <NewsAdminLayout>

      <div className="md:basis-2/5 w-full h-full">
        <UploadBanner
          required
          maxSize={5}
          onFileChange={handleFileChange}
          initialFile={bannerFile}
        />
      </div>

      <div>
        <RadioGroup
          required
          value={newsType}
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
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue ?? '')}
          style={{ height: '520px' }}
        />
      </div>

      <div>
        <BannerToggle
          checked={isBannerActive}
          onChange={setIsBannerActive}
          showLabel
        />
        <div className="mt-16 flex justify-end gap-5">
          <ActionButton type="cancel" onClick={() => console.log('Cancel clicked')} />
          <ActionButton type="save" onClick={handleSave} />
        </div>
      </div>
      </NewsAdminLayout>
    </div>
  );
}

export default AddNews;
