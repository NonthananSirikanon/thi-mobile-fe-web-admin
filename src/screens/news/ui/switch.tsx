import React from 'react';
import { Switch } from 'antd';

interface BannerToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  showLabel?: boolean;
}

const BannerToggle: React.FC<BannerToggleProps> = ({
  checked,
  onChange,
  showLabel = true,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch checked={checked} onChange={onChange} />
      {showLabel && (
        <span className='pl-2' style={{ color: '#666', fontSize: '14px' }}>
          Active / Inactive banner
        </span>
      )}
    </div>
  );
};

export default BannerToggle;
