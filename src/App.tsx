import { useState } from 'react';
import './App.css';
import StatusToggle from './components/ui/statustoggle';
import ActionButton from './components/ui/actionbutton';
import { Link } from 'react-router-dom';
import { AntTable, type TableModel } from './components/ui/table';


function App() {
  const [isActive, setIsActive] = useState(true);
  //const [data, setData] = useState(dummyData);
const demoData: TableModel = {
  header: ['Position', 'Status', 'Banner', 'URL', 'Created By', 'Edited By', 'Start Date', 'End Date', 'Duration', 'Publish Date', 'Actions'],
  body: {
    data: [
      {
        text: ['1', 'true', 'banner', 'https://example.com', 'John Doe', 'Jane Smith', '31/08/2022 20:00', '31/08/2022 20:05', '5(s)', '31/12/2024 20:00'],
        function: { onClick: () => console.log('Action clicked') }
      },
      {
        text: ['2', 'false', 'banner', 'https://google.com', 'Alice Brown', 'Bob Wilson', '01/09/2022 15:30', '01/09/2022 15:35', '5(s)', '01/01/2025 15:30'],
        function: { onClick: () => console.log('Action clicked') }
      },
      {
        text: ['3', 'true', 'banner', '-', 'Charlie Davis', 'Diana Moore', '02/09/2022 10:00', '02/09/2022 10:10', '10(s)', '02/01/2025 10:00'],
        function: { onClick: () => console.log('Action clicked') }
      }
    ]
  }
};
  

  return (
    
      <div className="space-y-6">
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
          <AntTable {...demoData} />
          </div>
          
          <nav className="mt-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700 mr-2">Home</Link> | 
            <Link to="/addbanner" className="text-blue-500 hover:text-blue-700 ml-2">Add Banner</Link>
          </nav>
        
      </div>
    
  );
}

export default App;