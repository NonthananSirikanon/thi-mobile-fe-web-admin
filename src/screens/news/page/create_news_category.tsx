import { useState } from "react";
import { Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import ActionButton from "../ui/actionbutton";
import "../news.css";
import NewsAdminLayout from "./add_news_layout";
import { AntTable, type TableModel } from "../ui/table";

function NewsCategoryPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

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
    setIsConfirmOpen(true); // แสดง popup ยืนยัน
  };

  const handleConfirmOk = () => {
    console.log("✅ สร้าง category:", categoryName);
    setIsConfirmOpen(false);
    setCategoryName('');
  };

  const tableData: TableModel = {
    header: ["#", "Status", "Headline", "Type", "Created At", "Updated At", "Actions"],
    body: {
      data: newsList.map((item, index) => ({
        key: item.id,
        id: item.id,
        headline: item.headline || "",
        textDetail: item.text || "",
        newsType: item.newsType || "",
        category: item.category || "",
        text: [
          (index + 1).toString(),
          item.isBannerActive?.toString() || "",
          item.headline || "",
          item.newsType || "",
          item.createdAt || "",
          item.updatedAt || "",
          "",
        ],
        function: {
          onClick: () => console.log("Clicked:", item.id),
        },
      })),
    },
  };

  return (
    <NewsAdminLayout>
      {/* คำเตือน */}
      <div className="bg-[#FFF0D3] text-[12px] p-5 rounded">
        <p><span className="text-red-500">*</span> Adding, editing, or deleting a news category here will affect:
          The “Select News Category” dropdown in the Add News page.</p>
        <p>News grouping and filtering on the user-facing News page.
          Please review changes carefully to avoid data mismatch.</p>
      </div>

      {/* ปุ่ม Action */}
      <div className="flex justify-between justify-end p-4 w-full">
        <div className="flex flex-wrap gap-4">
          <ActionButton type="createNewsCategory" onClick={handleCreateClick} />
          <ActionButton type="saveChangesCategory" onClick={() => console.log("Save clicked")} />
        </div>
      </div>

      {/* ตาราง */}
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

export default NewsCategoryPage;
