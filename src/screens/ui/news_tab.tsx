// components/ui/NewsTabSelector.tsx
import React from 'react';

interface NewsTabSelectorProps {
  selected: 'hot' | 'feature';
  onChange: (tab: 'hot' | 'feature') => void;
}

const NewsTabSelector: React.FC<NewsTabSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="flex ml-10 space-x-8">
      <button
        className={` border-b-2 transition-colors duration-300 ${
          selected === 'hot' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
        }`}
        onClick={() => onChange('hot')}
      >
        Hot News
      </button>
      <button
        className={` border-b-2 transition-colors duration-300 ${
          selected === 'feature' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
        }`}
        onClick={() => onChange('feature')}
      >
        Feature News
      </button>
    </div>
  );
};

export default NewsTabSelector;
