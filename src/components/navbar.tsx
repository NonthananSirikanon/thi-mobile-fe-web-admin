import React from 'react';
import { Play } from 'lucide-react';
import myImage from '../assets/Logo_thai.png'; 

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`bg-white border-b border-gray-200 px-6 py-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        
        <div className="flex items-center space-x-3">
          <div className="w-[39px] h-[39px]">
           <img src={myImage} alt="my image" />
           </div>
          
          <h1 className="text-xl font-medium text-gray-800">
            Thailand Headline
          </h1>
        </div>


        <div className="flex items-center space-x-4">
         
          <button className="w-10 h-10 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Play className="w-5 h-5 text-gray-600 ml-0.5" fill="currentColor" />
          </button>
          
          
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors">
            DE
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;