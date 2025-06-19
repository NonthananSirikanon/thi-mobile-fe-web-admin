import { useEffect, useState } from "react";
import UploadBanner from "../ui/banner_upload";
import { TextInput } from "../ui/text_input";
import BannerToggle from "../ui/switch";
import ActionButton from "../ui/actionbutton";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import FileUploader from "../ui/input_file";

function AddMagazine() {
  const { id } = useParams();
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [title, setTitle] = useState('');
  const [issueNumber, setIssueNumber] = useState('');
  const [pdfFileName, setPdfFileName] = useState<string | undefined>(undefined);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const DB_VERSION = 5;
  const [readVolume, setReadVolume] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const db = await openDB();
      const tx = db.transaction("magazine-drafts", "readonly");
      const store = tx.objectStore("magazine-drafts");
      const request = store.get(parseInt(id));

      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          setTitle(data.title || '');
          setIssueNumber(data.issueNum || '');
          setIsBannerActive(data.isBannerActive || false);
          if (data.pdfMagazine) {
            setPdfBase64(data.pdfMagazine);
            setPdfFileName("detail.pdf");
          }

          setReadVolume(data.readVolume ?? 0);

          if (data.bannerFile) {
            fetch(data.bannerFile)
              .then(res => res.blob())
              .then(blob => {
                const file = new File([blob], "banner.png", { type: blob.type });
                setBannerFile(file);
              });
          }
        }
      };

      request.onerror = () => {
        console.error("ไม่สามารถโหลดข้อมูลสำหรับแก้ไข:", request.error);
      };
    };

    loadData();
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
        if (!db.objectStoreNames.contains("magazine-drafts")) {
          db.createObjectStore("magazine-drafts", { keyPath: "front_id" });
        }
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "key" });
        }
      };

      request.onsuccess = () => {
        const db = request.result;

        const missingStores: string[] = [];
        if (!db.objectStoreNames.contains("magazine-drafts")) missingStores.push("magazine-drafts");
        if (!db.objectStoreNames.contains("images")) missingStores.push("images");

        if (missingStores.length > 0) {
          db.close();
          const newVersion = db.version + 1;

          const upgradeRequest = indexedDB.open("MyDB", newVersion);

          upgradeRequest.onupgradeneeded = () => {
            const upgradedDB = upgradeRequest.result;
            if (!upgradedDB.objectStoreNames.contains("magazine-drafts")) {
              upgradedDB.createObjectStore("magazine-drafts", { keyPath: "front_id" });
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
      id: 0,
      title: title,
      issueNum: issueNumber,
      isBannerActive,
      bannerFile: null as string | null,
      pdfMagazine: pdfBase64,
      readVolume,
      createdAt: now,
      updatedAt: now,
    };

    return new Promise<void>((resolve, reject) => {
      const completeSave = () => {
        const tx = db.transaction("magazine-drafts", "readwrite");
        const store = tx.objectStore("magazine-drafts");

        // ตรวจสอบว่ามีข่าวนี้อยู่แล้วไหม (ถ้าต้องการอัปเดต ไม่ใช่สร้างใหม่)
        const existingRequest = store.get(frontId);
        existingRequest.onsuccess = () => {
          const existing = existingRequest.result;
          if (existing) {
            // ถ้ามีข่าวเดิมแล้ว → อัปเดต updatedAt เท่านั้น
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
      navigate('/magazine');
    } catch (err) {
      console.error("Failed to save draft:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold mb-4">Add News</h1>

      <div className="md:basis-2/5 w-full h-full">
        <UploadBanner
          required
          maxSize={5}
          onFileChange={handleFileChange}
          initialFile={bannerFile}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0">
        <div className="md:basis-1/2 w-full space-y-4">
          <TextInput
            label="Title"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="md:basis-1/2 w-full h-full">
          <TextInput
            label="Issue Number"
            placeholder="Enter issue number"
            value={issueNumber}
            onChange={(e) => setIssueNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0">
        <div className="md:basis-1/2 space-y-4">
          <FileUploader
            initialBase64={pdfBase64 ?? undefined}
            initialFileName={pdfFileName}
            onFileSelectBase64={setPdfBase64}
          />
          {pdfBase64 && (
            <div className="mt-4">
              <h3 className="text-md font-medium">Preview PDF</h3>
              <iframe
                src={pdfBase64}
                title="PDF Preview"
                className="w-full h-96 border border-gray-300 rounded"
              ></iframe>
            </div>
          )}
        </div>
        <div className="md:basis-1/2"></div>
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
    </div>
  );
}

export default AddMagazine;
