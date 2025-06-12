import { useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface ThailandHeadlineProps {
  collapsed: boolean;
}

const ThailandHeadline = ({ collapsed }: ThailandHeadlineProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { pathname } = useLocation();

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const menuItems = [
    { to: "/", label: "Banner" },
    { to: "/news", label: "News" },
    { to: "/magazine", label: "Magazine" },
  ];

  return collapsed ? (
    <div className="p-2">
      <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mx-auto">
        <Monitor className="w-6 h-6 text-white" />
      </div>
    </div>
  ) : (
    <div className="mx-3 my-2">
      <button
        className="flex items-center justify-between w-full p-3 rounded-md bg-blue-50 hover:bg-blue-100"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <span className="text-blue-600 font-medium text-sm">Thailand Headline</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-blue-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1 ml-2">
          {menuItems.map(({ to, label }) => {
            const isActive = pathname === to;
            const baseClass = "px-4 py-2 rounded-lg font-medium text-sm block";
            const activeClass = isActive
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "text-gray-600 hover:bg-gray-100";

            return (
              <Link key={to} to={to}>
                <div className={`${baseClass} ${activeClass}`}>{label}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProSidebar = ({ className = "" }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#ffffff"
      width="280px"
      collapsedWidth="80px"
      className={`h-screen ${className}`}
      style={{ borderRight: "1px solid #e5e7eb" }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <h2 className="text-lg font-semibold text-gray-800">Menu</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-100">
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <ThailandHeadline collapsed={collapsed} />
    </Sidebar>
  );
};

export default ProSidebar;
