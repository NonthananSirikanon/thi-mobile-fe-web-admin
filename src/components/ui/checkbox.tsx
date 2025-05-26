import React from 'react';
import { Checkbox } from 'antd';

interface NoExpirationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const NoExpirationCheckbox: React.FC<NoExpirationCheckboxProps> = ({
  checked,
  onChange,
  label = 'No expiration date.',
}) => {
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{ fontWeight: '500', fontSize: '16px' }}
    >
      {label}
    </Checkbox>
  );
};

export default NoExpirationCheckbox;
