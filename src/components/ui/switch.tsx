import React from 'react';
import { Switch } from 'antd';

interface BannerToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  showLabel?: boolean;
}

const BannerToggle: React.FC<BannerToggleProps> = ({
  id,
  checked,
  onChange,
  showLabel = false,
}) => {
  return (
    <div className="flex items-center gap-2 space-x-2">
      <Switch id={id} checked={checked} onChange={onChange} />
      {showLabel && (
        <span style={{ color: '#666', fontSize: '14px' }}>
          Active / Inactive banner
        </span>
      )}
    </div>
  );
};

export default BannerToggle;
