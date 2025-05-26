import React, { useState } from 'react';
import './App.css';
import StatusToggle from './components/ui/statustoggle';
import ActionButton from './components/ui/actionbutton';
import { Link } from 'react-router-dom';
import { Table, type TableBodyModel } from './components/ui/table';


function App() {
  const [isActive, setIsActive] = useState(true);
  //const [data, setData] = useState(dummyData);
const headers = [
      'POSITION',
      'STATUS', 
      'BANNER',
      'URL',
      'CREATED BY',
      'EDITED BY',
      'START DATE - START TIME',
      'END DATE - END TIME',
      'DURATION',
      'PUBLISH',
      'ACTION'
    ];
  
    const sampleData: TableBodyModel = {
      data: [
        {
          text: [
            '1',
            'true',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png',
            'https://example.com/campaign1',
            'John Doe',
            'Jane Smith',
            '01/09/2024 09:00',
            '30/09/2024 18:00',
            '30 days',
            '01/09/2024 08:00'
          ],
          function: {
            onClick: () => console.log('Action clicked for row 1')
          }
        },
        {
          text: [
            '2',
            'false',
            'https://via.placeholder.com/64x40/4ecdc4/ffffff?text=AD2',
            'https://example.com/campaign2',
            'Mike Johnson',
            'Sarah Wilson',
            '15/09/2024 10:00',
            '15/10/2024 17:00',
            '30 days',
            '15/09/2024 09:00'
          ],
          function: {
            onClick: () => console.log('Action clicked for row 2')
          }
        },
        {
          text: [
            '3',
            'true',
            'banner',
            '-',
            'Alice Brown',
            'Bob Davis',
            '01/10/2024 14:00',
            '31/10/2024 23:59',
            '31 days',
            '01/10/2024 13:00'
          ],
          function: {
            onClick: () => console.log('Action clicked for row 3')
          }
        }
      ]

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
            <Table header={headers} body={sampleData} />
          </div>
          
          <nav className="mt-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700 mr-2">Home</Link> | 
            <Link to="/addbanner" className="text-blue-500 hover:text-blue-700 ml-2">Add Banner</Link>
          </nav>
        
      </div>
    
  );
}

export default App;