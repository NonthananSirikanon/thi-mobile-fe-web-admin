import ActionButton from "../ui/actionbutton";
import '../news.css';
import NewsAdminLayout from "./add_news_layout";
import { Modal, Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AntTable, type TableModel } from "../ui/table";

function NewsAgencyPage() {
  const [newsList, setNewsList] = useState<any[]>([
    {
      id: '1',
      headline: 'Test Headline',
      text: 'Some text',
      newsType: 'Hot',
      category: 'Politics',
      isBannerActive: true,
      bannerFile: 'banner.jpg',
      createdBy: 'Admin',
      lastEditedBy: 'Editor',
      createdAt: '2025-06-01',
      updatedAt: '2025-06-05',
      publishDate: '2025-06-10',
      publishTime: '12:00',
    }
  ]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
          "", // Placeholder for actions
        ],
        function: {
          onClick: () => console.log("Clicked:", item.id),
        },
      })),
    },
  };

  return (
    <div className="space-y-6">
      <NewsAdminLayout>
        <div className="bg-[#FFF0D3] text-[12px] p-5 rounded">
          <p><span className="text-red-500">*</span> Adding, editing, or deleting a news category here will affect:
            The “Select News Category” dropdown in the Add News page.</p>
          <p>News grouping and filtering on the user-facing News page.
            Please review changes carefully to avoid data mismatch.</p>
        </div>
        <div className="flex justify-between items-center justify-end p-4 w-full">
          <div className="flex flex-wrap gap-4 justify-end flex-none">
            <ActionButton type="createNewsAgency" onClick={handleCreateClick} />
            <ActionButton type="saveChangesAgency" onClick={() => console.log("Save clicked")} />
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
          title={<div className="text-lg font-semibold mb-3">Add News Agency</div>}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
          okText="Update"
          cancelText="Cancel"
          wrapClassName="custom-modal"
          centered
          footer={(_, { OkBtn, CancelBtn }) => (
            <div className="flex justify-center gap-4 mt-5">
              <CancelBtn />
              <OkBtn />
            </div>
          )}
        >
          <div className="mb-3 bg-[#FFF0D3] text-[12px] p-2 rounded"><span className="text-red-500">*</span> This news agency will be available for selection when adding news.</div>
          <div className="justify-center">
            <div className="mx-20">
              <div className="text-sm font-medium mb-2">News Agency Name *</div>
              <Input
                placeholder="Enter News Agency Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
        </Modal>


        <Modal
          width={465}
          title={<div className="text-center text-lg font-semibold mb-5">Add Item Confirmation</div>}
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
          <p className="text-center">Are you sure you want to add this item? Please ensure all details are correct.</p>
        </Modal>
      </NewsAdminLayout>
    </div>
  );
}

export default NewsAgencyPage;
