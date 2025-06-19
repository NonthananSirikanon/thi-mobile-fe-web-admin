import { useEffect, useState } from "react";
import { Modal, Input, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import ActionButton from "../ui/actionbutton";
import "../news.css";
import NewsAdminLayout from "./add_news_layout";
import { AntTable, type TableModel } from "../ui/table_cetegory";
import { createNewsCategory, fetchCategoryFromAPI } from "../service/news_category";
import { fetchAgencyFromAPI } from "../service/news_agency";

function NewsAgencyPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | null>(null);


  useEffect(() => {
  async function loadCategories() {
    try {
      const categories = await fetchAgencyFromAPI();
      if (Array.isArray(categories)) {
        setNewsList(categories);
      } else {
        console.warn("fetchAgencyFromAPI did not return an array:", categories);
        setNewsList([]);
      }
    } catch (error) {
      console.error("โหลด agency ล้มเหลว:", error);
      setNewsList([]);
    }
  }

  loadCategories();
}, []);



  const handleEdit = (id: string) => {
    navigate(`/addCategory/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const newList = newsList.filter((item) => item.id.toString() !== id.toString());
      setNewsList(newList);
    } catch (error) {
      console.error("ลบข่าวไม่สำเร็จ:", error);
    }
  };

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    setIsConfirmOpen(true);
  };

  const handleConfirmOk = async () => {
    try {
      const result = await createNewsCategory(categoryName, false, 1 );
      console.log("✅ สร้าง category:", result);

      setIsConfirmOpen(false);
      setCategoryName('');

      const categories = await fetchCategoryFromAPI();
      setNewsList(categories);

      setNotificationMessage('Successfully updated');
      setNotificationType('success');
    } catch (error) {
      console.error("❌ สร้าง category ไม่สำเร็จ:", error);
      setNotificationMessage('Update failed');
      setNotificationType('error');
    }

    // ล้างข้อความหลัง 3 วิ
    setTimeout(() => {
      setNotificationMessage('');
      setNotificationType(null);
    }, 3000);
  };


  const tableData: TableModel = {
    header: ["#", "Status", "News Category", "Created By", "Last Edited By", "Created At", "Updated At", "Actions"],
    body: {
      data: newsList.map((item, index) => ({
        key: item.agencyId,
        id: item.agencyId,
        textDetail: item.text || "",
        newsType: item.newsType || "",
        category: item.category || "",
        text: [
          (index + 1).toString(),
          item.status?.toString() || "",
          item.name || "",
          item.createdBy || "",
          item.createdBy || "",
          item.createdAt || "",
          item.updatedAt || "",
          item.publicAt || "",
          "",
        ],
        function: {
          onClick: () => console.log("Clicked:", item.agencyId),
        },
      })),
    },
  };

  return (
    <NewsAdminLayout>
      {notificationMessage && (
        <Alert
          message={notificationMessage}
          type={notificationType === 'success' ? 'success' : 'error'}
          showIcon
          className="my-4"
        />
      )}

      <div className="bg-[#FFF0D3] text-[12px] p-5 rounded">
        <p><span className="text-red-500">*</span> Adding, editing, or deleting a news category here will affect:
          The “Select News Category” dropdown in the Add News page.</p>
        <p>News grouping and filtering on the user-facing News page.
          Please review changes carefully to avoid data mismatch.</p>
      </div>

      <div className="flex justify-between justify-end p-4 w-full">
        <div className="flex flex-wrap gap-4">
          <ActionButton type="createNewsCategory" onClick={handleCreateClick} />
          <ActionButton type="saveChangesCategory" onClick={() => console.log("Save clicked")} />
        </div>
      </div>

      <div>
        <AntTable
          body={tableData.body}
          onEdit={(record) => handleEdit(record.key)}
          onDelete={(record) => handleDelete(record.key)}
        />
      </div>

      <Modal
        width={465}
        title={<div className="text-center text-lg font-semibold mb-5">Create News Category</div>}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
        cancelText="Cancel"
        centered
        wrapClassName="custom-modal"
        footer={(_, { OkBtn, CancelBtn }) => (
          <div className="flex justify-center gap-4 mt-5">
            <CancelBtn />
            <OkBtn />
          </div>
        )}
      >
        <div className="text-sm font-medium mb-2">News Category</div>
        <div className="flex justify-center">
          <Input
            placeholder="Enter news category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
      </Modal>


      <Modal
        width={465}
        title={<div className="text-center text-lg font-semibold mb-5">Confirm Changes</div>}
        open={isConfirmOpen}
        onOk={handleConfirmOk}
        onCancel={() => setIsConfirmOpen(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        wrapClassName="custom-modal"
        footer={(_, { OkBtn, CancelBtn }) => (
          <div className="flex justify-center gap-4 mt-5">
            <CancelBtn />
            <OkBtn />
          </div>
        )}
      >
        <p className="text-center">"{categoryName} category"</p>
        <p className="text-center">"Do you want to save these changes?"</p>
      </Modal>
    </NewsAdminLayout>
  );
}

export default NewsAgencyPage;
