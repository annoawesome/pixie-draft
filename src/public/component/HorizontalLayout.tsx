import React from "react";

import MainLayout from "./MainLayout";

export default function HorizontalLayout({ apiToken }: { apiToken: string }) {
  return (
    <div className="flex-column" id="header-body-layout">
      <header>Header</header>
      <MainLayout apiToken={apiToken} />
      <footer>Footer</footer>
    </div>
  );
}
