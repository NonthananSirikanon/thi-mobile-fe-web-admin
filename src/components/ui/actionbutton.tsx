import React from 'react';
import { Button } from 'antd';

export type ButtonType = 'addBanner' | 'previewAll' | 'publish' | 'cancel' | 'save';

type ButtonConfig = {
  label: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  width?: number;
  height?: number;
};

const buttonConfigs: Record<ButtonType, ButtonConfig> = {
  addBanner: {
    label: 'ADD BANNER',
    bgColor: '#1976D2',
    textColor: '#FFFFFF',
  },
  previewAll: {
    label: 'PREVIEW ALL',
    bgColor: '#9C27B0',
    textColor: '#FFFFFF',
  },
  publish: {
    label: 'PUBLISH',
    bgColor: '#2E7D32',
    textColor: '#FFFFFF',
  },
  cancel: {
    label: 'CANCEL',
    bgColor: '#FFFFFF',
    textColor: '#F44336',
    borderColor: '#F44336',
    width: 104,
    height: 39,
  },
  save: {
    label: 'SAVE',
    bgColor: '#0065D0',
    textColor: '#FFFFFF',
    borderColor: '#0065D0',
    width: 104,
    height: 39,
  },
};

type ActionButtonProps = {
  type: ButtonType;
  onClick?: () => void;
};

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => {
  const { label, bgColor, textColor, borderColor, width = 133, height = 37 } = buttonConfigs[type];

  
  const antType = type === 'cancel' ? 'default' : 'primary';

  return (
    <Button
      type={antType}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: '14px',
        backgroundColor: bgColor,
        borderColor: borderColor ?? bgColor,
        color: textColor,
        borderRadius: 8,
      }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default ActionButton;
