import React, { useState } from 'react';

// ============ TYPES & INTERFACES ============
export interface TableDataModel {
  text: string[];
  function: {
    onClick?: () => void; 
  };
}

export interface TableBodyModel {
  data: TableDataModel[];
}

export interface TableModel {
  header: string[];
  body: TableBodyModel;
}

// ============ ANT DESIGN SWITCH COMPONENT ============
const AntSwitch: React.FC<{ checked: boolean; onChange?: (checked: boolean) => void }> = ({ 
  checked, 
  onChange 
}) => (
  <button
    onClick={() => onChange?.(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      checked ? 'bg-blue-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-md ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ============ DRAG HANDLE COMPONENT ============
const DragHandle: React.FC<{ onDragStart?: (e: React.DragEvent) => void }> = ({ onDragStart }) => (
  <td className="p-3 w-8">
    <div 
      className="flex items-center justify-center text-gray-400 cursor-move hover:text-gray-600 transition-colors"
      draggable
      onDragStart={onDragStart}
      role="button"
      tabIndex={0}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="3" cy="4" r="1"/>
        <circle cx="3" cy="8" r="1"/>
        <circle cx="3" cy="12" r="1"/>
        <circle cx="8" cy="4" r="1"/>
        <circle cx="8" cy="8" r="1"/>
        <circle cx="8" cy="12" r="1"/>
        <circle cx="13" cy="4" r="1"/>
        <circle cx="13" cy="8" r="1"/>
        <circle cx="13" cy="12" r="1"/>
      </svg>
    </div>
  </td>
);

// ============ STATUS TOGGLE COMPONENT ============
const StatusToggle: React.FC<{ isActive: boolean; onChange?: (checked: boolean) => void }> = ({ 
  isActive, 
  onChange 
}) => (
  <td className="p-3 w-20">
    <AntSwitch checked={isActive} onChange={onChange} />
  </td>
);

// ============ BANNER COMPONENT ============
const BannerImage: React.FC<{ src?: string; alt?: string }> = ({ 
  src, 
  alt = "Banner" 
}) => (
  <td className="p-3 w-24">
    <div className="w-16 h-10 rounded overflow-hidden border border-gray-200">
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.nextElementSibling) {
              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div 
        className={`w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold ${src ? 'hidden' : 'flex'}`}
      >
        BANNER
      </div>
    </div>
  </td>
);

// ============ URL COMPONENT ============
const UrlCell: React.FC<{ url: string }> = ({ url }) => (
  <td className="p-3">
    {url === '-' ? (
      <span className="text-gray-400">-</span>
    ) : (
      <a 
        href={url} 
        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
    )}
  </td>
);

// ============ TEXT CELL COMPONENT ============
const TextCell: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <td className={`p-3 text-sm text-gray-700 ${className}`}>
    {text}
  </td>
);

// ============ DATE TIME CELL COMPONENT ============
const DateTimeCell: React.FC<{ date: string; time: string }> = ({ date, time }) => (
  <td className="p-3 text-sm text-gray-700">
    <div className="leading-tight">
      <div>{date}</div>
      <div className="text-gray-500">{time}</div>
    </div>
  </td>
);

// ============ ACTION MENU COMPONENT ============
const ActionMenu: React.FC<{ onAction?: () => void }> = ({ onAction }) => (
  <td className="p-3 w-12">
    <button
      onClick={onAction}
      className="inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 transition-colors"
    >
      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
        <circle cx="2" cy="8" r="1.5"/>
        <circle cx="8" cy="8" r="1.5"/>
        <circle cx="14" cy="8" r="1.5"/>
      </svg>
    </button>
  </td>
);

// ============ TABLE HEADER COMPONENT ============
const TableHeader: React.FC<{ headers: string[] }> = ({ headers }) => (
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>
      {headers.map((header, index) => (
        <th
          key={index}
          className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

// ============ TABLE ROW COMPONENT ============
interface TableRowProps {
  data: {
    position: string;
    status: boolean;
    banner?: string;
    url: string;
    createdBy: string;
    editedBy: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    duration: string;
    publishDate: string;
    publishTime: string;
  };
  index: number;
  onAction?: () => void;
  onStatusChange?: (checked: boolean) => void;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  isDragging?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ 
  data, 
  index, 
  onAction, 
  onStatusChange, 
  onDragStart, 
  onDragOver, 
  onDrop,
  isDragging 
}) => (
  <tr 
    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
      isDragging ? 'opacity-50' : ''
    }`}
    onDragOver={onDragOver}
    onDrop={(e) => onDrop?.(e, index)}
  >
    <DragHandle onDragStart={(e) => onDragStart?.(e, index)} />
    <StatusToggle isActive={data.status} onChange={onStatusChange} />
    <BannerImage src={data.banner} />
    <UrlCell url={data.url} />
    <TextCell text={data.createdBy} />
    <TextCell text={data.editedBy} />
    <DateTimeCell date={data.startDate} time={data.startTime} />
    <DateTimeCell date={data.endDate} time={data.endTime} />
    <TextCell text={data.duration} className="text-center" />
    <DateTimeCell date={data.publishDate} time={data.publishTime} />
    <ActionMenu onAction={onAction} />
  </tr>
);

// ============ MAIN TABLE COMPONENT ============
export const Table: React.FC<TableModel> = ({ header, body }) => {
  const [tableData, setTableData] = useState(body.data);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    const newData = [...tableData];
    const draggedItemData = newData[draggedItem];
    
    // Remove dragged item
    newData.splice(draggedItem, 1);
    
    // Insert at new position
    const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex;
    newData.splice(insertIndex, 0, draggedItemData);
    
    setTableData(newData);
    setDraggedItem(null);
  };

  const handleStatusChange = (index: number, checked: boolean) => {
    const newData = [...tableData];
    // Update the status in the text array
    newData[index] = {
      ...newData[index],
      text: [
        ...newData[index].text.slice(0, 1),
        checked.toString(),
        ...newData[index].text.slice(2)
      ]
    };
    setTableData(newData);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader headers={header} />
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((item, index) => {
              // Parse the text array into structured data
              const rowData = {
                position: item.text[0] || '',
                status: item.text[1] === 'true' || item.text[1]?.includes('true'),
                banner: item.text[2] !== 'banner' && item.text[2] ? item.text[2] : undefined,
                url: item.text[3] || '-',
                createdBy: item.text[4] || 'Text',
                editedBy: item.text[5] || 'Text',
                startDate: item.text[6]?.split(' ')[0] || '31/08/2022',
                startTime: item.text[6]?.split(' ')[1] || '20:00',
                endDate: item.text[7]?.split(' ')[0] || '31/08/2022',
                endTime: item.text[7]?.split(' ')[1] || '20:00',
                duration: item.text[8] || '5(s)',
                publishDate: item.text[9]?.split(' ')[0] || '31/12/2024',
                publishTime: item.text[9]?.split(' ')[1] || '20:00',
              };

              return (
                <TableRow
                  key={`${index}-${item.text[0]}`}
                  data={rowData}
                  index={index}
                  onAction={item.function.onClick}
                  onStatusChange={(checked) => handleStatusChange(index, checked)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragging={draggedItem === index}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

