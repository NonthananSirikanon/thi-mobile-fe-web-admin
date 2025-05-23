import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Home,
  FileText,
  Settings,
  Users,
  BarChart3,
  Image,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProSidebarProps {
  className?: string;
}

const ProSidebar: React.FC<ProSidebarProps> = ({ className = "" }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItemStyles = {
    root: {
      fontSize: "14px",
      fontWeight: 400,
    },
    icon: {
      color: "#6b7280",
      "&:hover": {
        color: "#3b82f6",
      },
    },
    SubMenuExpandIcon: {
      color: "#6b7280",
    },
    subMenuContent: {
      backgroundColor: "#f8fafc",
    },
    button: {
      "&:hover": {
        backgroundColor: "#f1f5f9",
        color: "#1e40af",
      },
      "&.ps-active": {
        backgroundColor: "#dbeafe",
        color: "#1e40af",
      },
    },
  };

  return (
    <div className={`h-screen ${className}`}>
      <Sidebar
        collapsed={collapsed}
        backgroundColor="#ffffff"
        width="280px"
        collapsedWidth="80px"
        style={{
          height: "100%",
          borderRight: "1px solid #e5e7eb",
        }}
      >
        
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors "
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        
        <Menu menuItemStyles={menuItemStyles}>
          <MenuItem icon={<Home />} component={<Link to="/" />}>
            Dashboard
          </MenuItem>

          <SubMenu label="Thailand Headline" icon={<FileText />}>
            <MenuItem component={<Link to="/" />}>Banner</MenuItem>
            <MenuItem>News</MenuItem>
          </SubMenu>

          <SubMenu label="Media" icon={<Image />}>
            <MenuItem>Images</MenuItem>
            <MenuItem>Videos</MenuItem>
            <MenuItem>Gallery</MenuItem>
          </SubMenu>

          <MenuItem icon={<BarChart3 />}>Analytics</MenuItem>

          <MenuItem icon={<Calendar />}>Schedule</MenuItem>

          <MenuItem icon={<Users />}>User Management</MenuItem>

          <SubMenu label="Settings" icon={<Settings />}>
            <MenuItem>General</MenuItem>
            <MenuItem>Appearance</MenuItem>
            <MenuItem>Security</MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default ProSidebar;
