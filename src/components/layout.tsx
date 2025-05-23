import React from 'react';
import ProSidebar from './sidebar';
import Navbar from './navbar';
import BreadCrumbNavigation from './ui/breadcrumb';



interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ProSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="ml-3 mt-3">
              <BreadCrumbNavigation />
          </div>
          <div className="m-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;