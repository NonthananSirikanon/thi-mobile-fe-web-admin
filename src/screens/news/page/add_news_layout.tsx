// src/layouts/NewsAdminLayout.tsx
import React from "react";
import NewsAdminMenu from "../ui/news_menu";

interface Props {
  children: React.ReactNode;
}

function NewsAdminLayout({ children }: Props) {
  return (
    <div className="space-y-6">
      <div className="mt-4">
        <NewsAdminMenu />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default NewsAdminLayout;
