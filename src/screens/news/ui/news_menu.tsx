import type { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NewsAdminMenu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.startsWith('/addnews')) return 'addNews';
    if (location.pathname.startsWith('/newsCategory')) return 'createCategory';
    if (location.pathname.startsWith('/newsAgency')) return 'addAgency';
    return '';
  };

  const activeTab = getActiveTab();

  const handleChange = (tab: string) => {
    switch (tab) {
      case 'addNews':
        navigate('/addnews');
        break;
      case 'createCategory':
        navigate('/newsCategory');
        break;
      case 'addAgency':
        navigate('/newsAgency');
        break;
    }
  };

  return (
    <div className="flex ml-10 space-x-8">
      <TabButton
        label="Add News"
        isActive={activeTab === 'addNews'}
        onClick={() => handleChange('addNews')}
      />
      <TabButton
        label="Create News Category"
        isActive={activeTab === 'createCategory'}
        onClick={() => handleChange('createCategory')}
      />
      <TabButton
        label="Add News Agency"
        isActive={activeTab === 'addAgency'}
        onClick={() => handleChange('addAgency')}
      />
    </div>
  );
};

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`border-b-2 pb-2 transition-colors duration-300 ${
      isActive ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default NewsAdminMenu;
