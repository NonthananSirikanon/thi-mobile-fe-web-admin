import React from 'react';
import { Switch } from 'antd';

const onChange = (checked: boolean) => {
  console.log(`switch to ${checked}`);
};

const SwitchComponent: React.FC = () => (
  <div>
    <Switch defaultChecked onChange={onChange} />
  </div>
);

export default SwitchComponent;
