import React from 'react';
import { Breadcrumb } from 'antd';

const BreadCrumbNavigation: React.FC = () => (
  <Breadcrumb
    separator=">"
    style={{ color: '#0065D0' }}
    items={[
      {
        title: 'Home',
      },
      {
        title: 'Application Center',
        href: '',
      },
      {
        title: 'Application List',
        href: '',
      },
      {
        title: 'An Application',
      },
    ]}
  />
);

export default BreadCrumbNavigation;