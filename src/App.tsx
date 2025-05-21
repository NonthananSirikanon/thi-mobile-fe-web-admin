import React, { useState } from 'react';
import './App.css';
import BreadCrumbNavigation from './components/ui/breadcrumb';
import StatusToggle from './components/ui/statustoggle';
import BannerTable from './components/ui/bannertable';
import ActionButton from './components/ui/actionbutton';
import { Link } from 'react-router-dom';

const dummyData = [
  {
    key: '1',
    position: '=',
    status: true,
    bannerUrl: 'https://via.placeholder.com/60x40?text=BANNER+Design',
    link: 'https://ABC.com',
    createdBy: 'Text',
    editedBy: 'Text',
    start: '31/08/2022 20:00',
    end: '31/08/2022 20:00',
    duration: '5(s)',
    publish: '31/12/2024 20:00',
  },
];

function App() {
  const [isActive, setIsActive] = useState(true);
  const [data, setData] = useState(dummyData);

  const handleToggle = (key: string, checked: boolean) => {
    setData((prev) =>
      prev.map((item) => (item.key === key ? { ...item, status: checked } : item))
    );
  };
  
  return (
    
      <div className="space-y-6">
        <BreadCrumbNavigation/> 
          <div className="">
            <StatusToggle checked={isActive} onChange={setIsActive} />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-end">
            <Link to="/addbanner">
              <ActionButton 
                type="addBanner" 
                onClick={() => console.log('Add Banner clicked')} 
              />
            </Link>
            <ActionButton 
              type="previewAll" 
              onClick={() => console.log('Preview All clicked')} 
            />
            <ActionButton 
              type="publish" 
              onClick={() => console.log('Publish clicked')} 
            />
          </div>
        
          <div className="">
            <BannerTable data={data} onToggleStatus={handleToggle} />
          </div>
          
          <nav className="mt-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700 mr-2">Home</Link> | 
            <Link to="/addbanner" className="text-blue-500 hover:text-blue-700 ml-2">Add Banner</Link>
          </nav>
        
      </div>
    
  );
}

export default App;