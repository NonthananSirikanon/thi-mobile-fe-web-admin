import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const BreadCrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = [
    {
      title: <Link to="/">Home</Link>,
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSnippets.length - 1;
      const label = pathSnippets[index]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

      return {
        title: isLast ? (
          <span style={{ color: '#0065D0' }}>{label}</span>
        ) : (
          <Link to={url}>{label}</Link>
        ),
      };
    }),
  ];

  return (
    <Breadcrumb separator=">" items={breadcrumbItems} />
  );
};

export default BreadCrumbNavigation;
